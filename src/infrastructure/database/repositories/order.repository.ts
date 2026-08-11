import type { Prisma } from '@prisma/client';

import {
  createInfinitePayCheckoutLink,
  formatCheckoutCustomerPhone,
  OrderCheckoutValidationError,
  roundMoney,
  validateCheckoutOrder,
  type CheckoutCustomerInput,
  type CheckoutItemInput,
  type InfinitePayCheckoutItem,
} from '@application/services';
import { prisma } from '@infrastructure/database';
import {
  getInfinitePayRedirectUrl,
  getInfinitePayWebhookUrl,
} from '@shared/config/infinitepay.config';

export interface CreateOrderInput {
  customer: CheckoutCustomerInput;
  items: CheckoutItemInput[];
  shippingAddress: Record<string, unknown>;
  shippingMethod?: string;
  paymentMethod?: string;
  couponCode?: string;
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  total: number;
  couponDiscount: number;
  checkoutUrl: string;
  createdAt: string;
}

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  return `US-${ts}`;
}

function buildInfinitePayItems(input: {
  items: CheckoutItemInput[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  totalCents: number;
}): InfinitePayCheckoutItem[] {
  const subtotalCents = Math.round(input.subtotal * 100);
  const discountCents = Math.round(input.couponDiscount * 100);
  let allocatedDiscount = 0;

  const productItems = input.items.map((item, index, array) => {
    const lineCents = Math.round(item.unitPrice * item.quantity * 100);
    const isLast = index === array.length - 1;
    const discountShare = isLast
      ? discountCents - allocatedDiscount
      : subtotalCents > 0
        ? Math.floor((lineCents / subtotalCents) * discountCents)
        : 0;
    allocatedDiscount += discountShare;

    const discountedLineCents = Math.max(1, lineCents - discountShare);
    const unitCents = Math.max(
      1,
      Math.round(discountedLineCents / item.quantity),
    );

    return {
      quantity: item.quantity,
      price: unitCents,
      description: item.name.slice(0, 120),
    };
  });

  const shippingCents = Math.round(input.shipping * 100);
  if (shippingCents > 0) {
    productItems.push({
      quantity: 1,
      price: shippingCents,
      description: 'Frete',
    });
  }

  const sumCents = productItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const diff = input.totalCents - sumCents;

  if (diff !== 0 && productItems.length > 0) {
    const first = productItems[0];
    first.price = Math.max(1, first.price + Math.round(diff / first.quantity));
  }

  return productItems;
}

export async function createOrderFromCheckout(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const validated = await validateCheckoutOrder({
    customer: input.customer,
    items: input.items,
    shippingAddress: input.shippingAddress,
    shippingMethod: input.shippingMethod,
    couponCode: input.couponCode?.toUpperCase(),
  });

  const orderNumber = generateOrderNumber();
  const address = input.shippingAddress;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: orderNumber,
        status: 'payment_pending',
        customerId: validated.customerId,
        subtotal: validated.subtotal,
        shipping: validated.shipping,
        discount: validated.couponDiscount,
        total: validated.total,
        couponId: validated.couponId ?? null,
        couponCode: validated.couponCode ?? null,
        couponDiscount:
          validated.couponDiscount > 0 ? validated.couponDiscount : null,
        influencerId: validated.influencerId ?? null,
        campaignId: validated.campaignId ?? null,
        paymentMethod: input.paymentMethod ?? 'infinitepay',
        paymentStatus: 'pending',
        shippingAddress: address as Prisma.InputJsonValue,
        shippingMethod: validated.shippingMethod ?? null,
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId,
            variationId: item.variationId ?? null,
            slug: item.slug,
            sku: item.sku,
            name: item.name,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: roundMoney(item.unitPrice * item.quantity),
            size: item.size ?? null,
            colorLabel: item.colorLabel ?? null,
            modelLabel: item.modelLabel ?? null,
          })),
        },
      },
    });

    return created;
  });

  const infinitePayItems = buildInfinitePayItems({
    items: validated.items,
    subtotal: validated.subtotal,
    shipping: validated.shipping,
    couponDiscount: validated.couponDiscount,
    totalCents: validated.totalCents,
  });

  const customerName =
    `${input.customer.firstName} ${input.customer.lastName}`.trim();
  const link = await createInfinitePayCheckoutLink({
    orderNsu: order.number,
    items: infinitePayItems,
    redirectUrl: getInfinitePayRedirectUrl(),
    webhookUrl: getInfinitePayWebhookUrl(),
    customer: {
      name: customerName,
      email: input.customer.email,
      phone_number: formatCheckoutCustomerPhone(input.customer.phone),
    },
    address: {
      cep: String(address.cep ?? '').replace(/\D/g, ''),
      street: String(address.street ?? ''),
      neighborhood: String(address.neighborhood ?? ''),
      number: String(address.number ?? ''),
      complement: address.complement ? String(address.complement) : undefined,
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      orderId: order.id,
      provider: 'infinitepay',
      orderNsu: order.number,
      amountCents: validated.totalCents,
      status: 'pending',
      checkoutUrl: link.url,
    },
  });

  return {
    orderId: order.id,
    orderNumber: order.number,
    total: validated.total,
    couponDiscount: validated.couponDiscount,
    checkoutUrl: link.url,
    createdAt: order.createdAt.toISOString(),
  };
}

export { generateOrderNumber, OrderCheckoutValidationError };

export async function listOrdersForAdmin(filters?: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { number: { contains: q, mode: 'insensitive' } },
      { couponCode: { contains: q, mode: 'insensitive' } },
      {
        customer: {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  const [records, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: true,
        coupon: { select: { code: true } },
        influencer: { select: { name: true, identifierCode: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    }),
    prisma.order.count({ where }),
  ]);

  return { records, total };
}

export async function listAttributions(filters?: {
  dateFrom?: Date;
  dateTo?: Date;
  influencerId?: string;
  campaignId?: string;
  couponId?: string;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.influencerId) where.influencerId = filters.influencerId;
  if (filters?.campaignId) where.campaignId = filters.campaignId;
  if (filters?.couponId) where.couponId = filters.couponId;

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    };
  }

  const records = await prisma.couponRedemption.findMany({
    where,
    include: {
      order: { select: { number: true, total: true } },
      customer: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ createdAt: 'desc' }],
    take: filters?.limit ?? 100,
  });

  const { mapRedemptionToAttribution } =
    await import('@infrastructure/database/mappers/marketing.mapper');

  return records.map(mapRedemptionToAttribution);
}

export async function getMarketingDashboardStats(
  dateFrom?: Date,
  dateTo?: Date,
) {
  const dateFilter =
    dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : undefined;

  const [
    activeCoupons,
    activeCampaigns,
    activeInfluencers,
    redemptions,
    aggregate,
  ] = await Promise.all([
    prisma.coupon.count({ where: { status: 'active' } }),
    prisma.campaign.count({ where: { status: 'active' } }),
    prisma.influencer.count({ where: { status: 'active' } }),
    prisma.couponRedemption.findMany({
      where: dateFilter,
      select: {
        discountAmount: true,
        orderTotal: true,
        couponId: true,
      },
    }),
    prisma.couponRedemption.aggregate({
      where: dateFilter,
      _sum: { discountAmount: true, orderTotal: true },
      _count: { _all: true },
    }),
  ]);

  const usedCouponIds = new Set(redemptions.map((r) => r.couponId));
  const ordersFromCoupons = aggregate._count._all;
  const totalDiscount = Number(aggregate._sum.discountAmount ?? 0);
  const attributedRevenue = Number(aggregate._sum.orderTotal ?? 0);

  return {
    activeCoupons,
    usedCoupons: usedCouponIds.size,
    activeCampaigns,
    activeInfluencers,
    ordersFromCoupons,
    attributedRevenue,
    totalDiscount,
    averageTicketWithCoupon:
      ordersFromCoupons > 0 ? attributedRevenue / ordersFromCoupons : 0,
  };
}
