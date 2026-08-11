import { prisma } from '@infrastructure/database';
import {
  calculateCouponDiscountAmount,
  calculateSubtotal,
  countCustomerCouponRedemptions,
  CouponValidationError,
  roundMoney,
  validateCouponContext,
} from './coupon-validation.service';
import { calculateShippingFeeForOrder } from './shipping-calculation.service';
import {
  countCouponRedemptionsByCustomer,
  getCouponByCode,
} from '@infrastructure/database/repositories/coupon.repository';
import {
  countCustomerOrders,
  findOrCreateCustomer,
} from '@infrastructure/database/repositories/customer.repository';
import { resolveProductVariation } from '@shared/utils/product-variation.utils';

export class OrderCheckoutValidationError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'PRODUCT_NOT_FOUND'
      | 'PRODUCT_INACTIVE'
      | 'VARIATION_NOT_FOUND'
      | 'INSUFFICIENT_STOCK'
      | 'INVALID_QUANTITY' = 'PRODUCT_NOT_FOUND',
  ) {
    super(message);
    this.name = 'OrderCheckoutValidationError';
  }
}

export interface CheckoutItemInput {
  productId: string;
  variationId?: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  colorLabel?: string;
  modelLabel?: string;
  categoryId?: string;
  categorySlug?: string;
}

export interface CheckoutCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface ValidatedCheckoutItem {
  productId: string;
  variationId?: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  colorLabel?: string;
  modelLabel?: string;
  categoryId?: string;
  categorySlug?: string;
}

export interface ValidatedCheckoutOrder {
  customerId: string;
  customerOrderCount: number;
  items: ValidatedCheckoutItem[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  totalCents: number;
  couponId?: string;
  couponCode?: string;
  influencerId?: string;
  campaignId?: string;
  shippingMethod?: string;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return `+${digits}`;
  return `+55${digits}`;
}

export function formatCheckoutCustomerPhone(phone: string): string {
  return normalizePhone(phone);
}

export async function validateCheckoutOrder(input: {
  customer: CheckoutCustomerInput;
  items: CheckoutItemInput[];
  shippingAddress: Record<string, unknown>;
  shippingMethod?: string;
  couponCode?: string;
}): Promise<ValidatedCheckoutOrder> {
  if (!input.items.length) {
    throw new OrderCheckoutValidationError(
      'O pedido precisa conter ao menos um item.',
      'INVALID_QUANTITY',
    );
  }

  const customer = await findOrCreateCustomer(input.customer);
  const customerOrderCount = await countCustomerOrders(customer.id);

  const productIds = [...new Set(input.items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      category: true,
      variations: true,
      gallery: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const validatedItems: ValidatedCheckoutItem[] = [];

  for (const item of input.items) {
    if (item.quantity < 1) {
      throw new OrderCheckoutValidationError(
        'Quantidade inválida para um dos itens.',
        'INVALID_QUANTITY',
      );
    }

    const product = productById.get(item.productId);
    if (!product) {
      throw new OrderCheckoutValidationError(
        `Produto não encontrado: ${item.productId}`,
        'PRODUCT_NOT_FOUND',
      );
    }

    if (product.status !== 'active') {
      throw new OrderCheckoutValidationError(
        `Produto indisponível: ${product.name}`,
        'PRODUCT_INACTIVE',
      );
    }

    let unitPrice = Number(product.price);
    let variationId: string | undefined;
    let sku = product.sku;
    let availableStock = product.stockQuantity;

    if (product.variations.length > 0) {
      const variation = item.variationId
        ? product.variations.find((entry) => entry.id === item.variationId)
        : resolveProductVariation(
            product.variations.map((entry) => ({
              id: entry.id,
              size: entry.size ?? undefined,
              color: entry.color ?? undefined,
              model: entry.model ?? undefined,
              sku: entry.sku,
              price: Number(entry.price),
              stock: entry.stock,
            })),
            {
              size: item.size ?? '',
              colorLabel: item.colorLabel,
              modelLabel: item.modelLabel,
            },
          );

      if (!variation) {
        throw new OrderCheckoutValidationError(
          `Variação indisponível para ${product.name}.`,
          'VARIATION_NOT_FOUND',
        );
      }

      variationId = variation.id;
      unitPrice = Number(variation.price);
      sku = variation.sku;
      availableStock = variation.stock;
    } else if (!product.inStock || availableStock < item.quantity) {
      throw new OrderCheckoutValidationError(
        `Estoque insuficiente para ${product.name}.`,
        'INSUFFICIENT_STOCK',
      );
    }

    if (availableStock < item.quantity) {
      throw new OrderCheckoutValidationError(
        `Estoque insuficiente para ${product.name}.`,
        'INSUFFICIENT_STOCK',
      );
    }

    validatedItems.push({
      productId: product.id,
      variationId,
      slug: product.slug,
      sku,
      name: product.name,
      imageUrl: product.imageUrl || product.gallery[0]?.url || item.imageUrl,
      quantity: item.quantity,
      unitPrice: roundMoney(unitPrice),
      size: item.size,
      colorLabel: item.colorLabel,
      modelLabel: item.modelLabel,
      categoryId: product.categoryId,
      categorySlug: product.category.slug,
    });
  }

  const cartItems = validatedItems.map((item) => ({
    productId: item.productId,
    variationId: item.variationId,
    categoryId: item.categoryId,
    categorySlug: item.categorySlug,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const subtotal = calculateSubtotal(cartItems);
  let couponDiscount = 0;
  let couponRecord: Awaited<ReturnType<typeof getCouponByCode>> = null;

  if (input.couponCode) {
    couponRecord = await getCouponByCode(input.couponCode);
    if (!couponRecord) {
      throw new CouponValidationError('NOT_FOUND', 'Cupom inválido.');
    }

    validateCouponContext({
      coupon: couponRecord,
      items: cartItems,
      subtotal,
      customerId: customer.id,
      customerOrderCount,
    });

    await countCustomerCouponRedemptions(
      couponRecord.id,
      customer.id,
      countCouponRedemptionsByCustomer,
      couponRecord.usageLimitPerCustomer,
    );

    couponDiscount = calculateCouponDiscountAmount(
      couponRecord,
      cartItems,
      subtotal,
    );
  }

  const destinationCep = String(input.shippingAddress.cep ?? '').replace(
    /\D/g,
    '',
  );

  const shipping = await calculateShippingFeeForOrder({
    destinationCep,
    subtotal,
    couponCode: input.couponCode,
  });

  const total = roundMoney(Math.max(0, subtotal - couponDiscount + shipping));
  const totalCents = Math.round(total * 100);

  if (totalCents < 1) {
    throw new OrderCheckoutValidationError(
      'O total do pedido deve ser maior que zero.',
      'INVALID_QUANTITY',
    );
  }

  return {
    customerId: customer.id,
    customerOrderCount,
    items: validatedItems,
    subtotal,
    shipping,
    couponDiscount,
    total,
    totalCents,
    couponId: couponRecord?.id,
    couponCode: couponRecord?.code,
    influencerId: couponRecord?.influencerId ?? undefined,
    campaignId: couponRecord?.campaignId ?? undefined,
    shippingMethod: input.shippingMethod,
  };
}
