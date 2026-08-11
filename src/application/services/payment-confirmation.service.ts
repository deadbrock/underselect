import type { Prisma } from '@prisma/client';

import {
  checkInfinitePayPayment,
  type InfinitePayWebhookPayload,
} from './infinitepay.service';
import { prisma } from '@infrastructure/database';
import { incrementCouponUsageAtomic } from '@infrastructure/database/repositories/coupon.repository';
import { deriveProductStockFromVariations } from '@shared/utils/product-variation.utils';

export class PaymentConfirmationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentConfirmationError';
  }
}

function mapCaptureMethodToPaymentMethod(captureMethod: string): string {
  if (captureMethod === 'pix') return 'pix';
  if (captureMethod === 'credit_card') return 'card';
  return 'infinitepay';
}

async function decrementStockForOrder(
  tx: Prisma.TransactionClient,
  orderId: string,
): Promise<void> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.stockDecremented) return;

  for (const item of order.items) {
    if (item.variationId) {
      const variation = await tx.productVariation.findUnique({
        where: { id: item.variationId },
      });
      if (!variation) continue;

      const nextStock = Math.max(0, variation.stock - item.quantity);
      await tx.productVariation.update({
        where: { id: variation.id },
        data: { stock: nextStock },
      });
    } else {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) continue;

      const nextStock = Math.max(0, product.stockQuantity - item.quantity);
      await tx.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: nextStock,
          inStock: nextStock > 0,
        },
      });
    }
  }

  const productIds = [...new Set(order.items.map((item) => item.productId))];
  for (const productId of productIds) {
    const variations = await tx.productVariation.findMany({
      where: { productId },
    });

    if (variations.length === 0) continue;

    const stockSummary = deriveProductStockFromVariations(
      variations.map((variation) => ({
        id: variation.id,
        size: variation.size ?? undefined,
        sku: variation.sku,
        price: Number(variation.price),
        stock: variation.stock,
      })),
    );

    await tx.product.update({
      where: { id: productId },
      data: {
        stockQuantity: stockSummary.stockQuantity,
        inStock: stockSummary.inStock,
      },
    });
  }

  await tx.order.update({
    where: { id: orderId },
    data: { stockDecremented: true },
  });
}

export async function confirmOrderPaymentFromWebhook(
  payload: InfinitePayWebhookPayload,
): Promise<{ processed: boolean; orderNumber: string }> {
  const order = await prisma.order.findUnique({
    where: { number: payload.order_nsu },
    include: {
      items: true,
      redemption: true,
      paymentTransactions: true,
    },
  });

  if (!order) {
    throw new PaymentConfirmationError(
      'Pedido não encontrado para o order_nsu informado.',
    );
  }

  const expectedAmountCents = Math.round(Number(order.total) * 100);
  if (payload.amount !== expectedAmountCents) {
    throw new PaymentConfirmationError(
      'Valor informado no webhook diverge do pedido.',
    );
  }

  if (
    order.paymentStatus === 'approved' ||
    order.paymentTransactions.some(
      (entry) =>
        entry.status === 'approved' &&
        entry.transactionNsu === payload.transaction_nsu,
    )
  ) {
    return { processed: false, orderNumber: order.number };
  }

  const paymentCheck = await checkInfinitePayPayment({
    orderNsu: payload.order_nsu,
    transactionNsu: payload.transaction_nsu,
    slug: payload.invoice_slug,
  });

  if (!paymentCheck.success || !paymentCheck.paid) {
    throw new PaymentConfirmationError(
      'Pagamento não confirmado pela InfinitePay.',
    );
  }

  if (paymentCheck.amount !== expectedAmountCents) {
    throw new PaymentConfirmationError(
      'Valor confirmado pela InfinitePay diverge do pedido.',
    );
  }

  await prisma.$transaction(async (tx) => {
    const duplicate = await tx.paymentTransaction.findUnique({
      where: { transactionNsu: payload.transaction_nsu },
    });

    if (duplicate?.status === 'approved') {
      return;
    }

    if (duplicate) {
      await tx.paymentTransaction.update({
        where: { id: duplicate.id },
        data: {
          invoiceSlug: payload.invoice_slug,
          amountCents: paymentCheck.amount,
          paidAmountCents: paymentCheck.paid_amount,
          installments: paymentCheck.installments,
          captureMethod: paymentCheck.capture_method,
          status: 'approved',
          receiptUrl: payload.receipt_url ?? null,
          rawPayload: payload as unknown as Prisma.InputJsonValue,
        },
      });
    } else {
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: 'infinitepay',
          orderNsu: payload.order_nsu,
          transactionNsu: payload.transaction_nsu,
          invoiceSlug: payload.invoice_slug,
          amountCents: paymentCheck.amount,
          paidAmountCents: paymentCheck.paid_amount,
          installments: paymentCheck.installments,
          captureMethod: paymentCheck.capture_method,
          status: 'approved',
          receiptUrl: payload.receipt_url ?? null,
          rawPayload: payload as unknown as Prisma.InputJsonValue,
        },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'payment_approved',
        paymentStatus: 'approved',
        paymentMethod: mapCaptureMethodToPaymentMethod(
          paymentCheck.capture_method,
        ),
      },
    });

    if (order.couponId && !order.redemption) {
      await incrementCouponUsageAtomic(tx, order.couponId);
      await tx.couponRedemption.create({
        data: {
          couponId: order.couponId,
          orderId: order.id,
          customerId: order.customerId,
          influencerId: order.influencerId,
          campaignId: order.campaignId,
          discountAmount: Number(order.discount),
          orderTotal: Number(order.total),
        },
      });
    }

    await decrementStockForOrder(tx, order.id);
  });

  return { processed: true, orderNumber: order.number };
}

export async function getOrderPaymentStatus(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { number: orderNumber },
    include: {
      paymentTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!order) return null;

  const latest = order.paymentTransactions[0];

  return {
    orderNumber: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    captureMethod: latest?.captureMethod ?? null,
    receiptUrl: latest?.receiptUrl ?? null,
    transactionNsu: latest?.transactionNsu ?? null,
    invoiceSlug: latest?.invoiceSlug ?? null,
  };
}

export async function reconcileOrderPayment(input: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}) {
  const order = await prisma.order.findUnique({
    where: { number: input.orderNsu },
  });

  if (!order) {
    throw new PaymentConfirmationError('Pedido não encontrado.');
  }

  if (order.paymentStatus === 'approved') {
    return {
      paid: true,
      amountMatches: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };
  }

  const paymentCheck = await checkInfinitePayPayment(input);
  const expectedAmountCents = Math.round(Number(order.total) * 100);

  if (paymentCheck.paid && paymentCheck.success) {
    await confirmOrderPaymentFromWebhook({
      invoice_slug: input.slug,
      amount: paymentCheck.amount,
      paid_amount: paymentCheck.paid_amount,
      installments: paymentCheck.installments,
      capture_method: paymentCheck.capture_method,
      transaction_nsu: input.transactionNsu,
      order_nsu: input.orderNsu,
    });
  }

  const refreshed = await prisma.order.findUnique({
    where: { number: input.orderNsu },
  });

  return {
    paid: paymentCheck.paid && paymentCheck.success,
    amountMatches: paymentCheck.amount === expectedAmountCents,
    paymentStatus: refreshed?.paymentStatus ?? order.paymentStatus,
    orderStatus: refreshed?.status ?? order.status,
  };
}
