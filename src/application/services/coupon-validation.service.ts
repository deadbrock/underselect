import {
  parseRules,
  toNumber,
} from '@infrastructure/database/mappers/marketing.mapper';
import { ApplicationError } from '@application/errors';

export interface DbCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: { toString(): string } | number;
  startDate: Date;
  endDate: Date;
  usageLimit: number | null;
  usageCount: number;
  usageLimitPerCustomer: number | null;
  status: string;
  influencerId: string | null;
  campaignId: string | null;
  rules: unknown;
  categoryIds: string[];
  productIds: string[];
  variationIds: string[];
}

export interface CartItemForCoupon {
  productId: string;
  variationId?: string;
  categoryId?: string;
  categorySlug?: string;
  quantity: number;
  unitPrice: number;
}

export interface CouponValidationContext {
  coupon: DbCoupon;
  items: CartItemForCoupon[];
  subtotal: number;
  customerId?: string;
  customerOrderCount?: number;
}

export type CouponValidationErrorCode =
  | 'NOT_FOUND'
  | 'INACTIVE'
  | 'NOT_STARTED'
  | 'EXPIRED'
  | 'DEPLETED'
  | 'LIMIT_PER_CUSTOMER'
  | 'MIN_ORDER'
  | 'MIN_QUANTITY'
  | 'FIRST_PURCHASE'
  | 'CATEGORY'
  | 'PRODUCT'
  | 'CAMPAIGN';

export class CouponValidationError extends ApplicationError {
  constructor(
    public readonly code: CouponValidationErrorCode,
    message: string,
  ) {
    super(message, 'COUPON_VALIDATION_ERROR', 400);
  }
}

export function calculateSubtotal(items: CartItemForCoupon[]): number {
  return roundMoney(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateCouponContext(ctx: CouponValidationContext): void {
  const { coupon } = ctx;
  const now = Date.now();

  if (coupon.status === 'paused') {
    throw new CouponValidationError('INACTIVE', 'Este cupom está pausado.');
  }

  if (now < coupon.startDate.getTime()) {
    throw new CouponValidationError(
      'NOT_STARTED',
      'Este cupom ainda não está válido.',
    );
  }

  if (now > coupon.endDate.getTime()) {
    throw new CouponValidationError('EXPIRED', 'Este cupom está expirado.');
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new CouponValidationError(
      'DEPLETED',
      'Este cupom atingiu o limite de utilizações.',
    );
  }

  const rules = parseRules(coupon.rules);
  const subtotal = ctx.subtotal;
  const totalQuantity = ctx.items.reduce((sum, i) => sum + i.quantity, 0);

  if (rules.minOrderValue && subtotal < rules.minOrderValue) {
    throw new CouponValidationError(
      'MIN_ORDER',
      `Pedido mínimo de R$ ${rules.minOrderValue.toFixed(2).replace('.', ',')} para este cupom.`,
    );
  }

  if (rules.minQuantity && totalQuantity < rules.minQuantity) {
    throw new CouponValidationError(
      'MIN_QUANTITY',
      `Quantidade mínima de ${rules.minQuantity} itens para este cupom.`,
    );
  }

  if (rules.firstPurchaseOnly && (ctx.customerOrderCount ?? 0) > 0) {
    throw new CouponValidationError(
      'FIRST_PURCHASE',
      'Cupom válido apenas para a primeira compra.',
    );
  }

  if (rules.categorySlug) {
    const hasCategory = ctx.items.some(
      (item) => item.categorySlug === rules.categorySlug,
    );
    if (!hasCategory) {
      throw new CouponValidationError(
        'CATEGORY',
        'Cupom não válido para os produtos do carrinho.',
      );
    }
  }

  if (coupon.categoryIds.length > 0) {
    const hasCategory = ctx.items.some(
      (item) => item.categoryId && coupon.categoryIds.includes(item.categoryId),
    );
    if (!hasCategory) {
      throw new CouponValidationError(
        'CATEGORY',
        'Cupom não válido para a categoria dos produtos.',
      );
    }
  }

  const productIds = [
    ...coupon.productIds,
    ...(rules.productId ? [rules.productId] : []),
  ];
  if (productIds.length > 0) {
    const hasProduct = ctx.items.some((item) =>
      productIds.includes(item.productId),
    );
    if (!hasProduct) {
      throw new CouponValidationError(
        'PRODUCT',
        'Cupom não válido para os produtos do carrinho.',
      );
    }
  }

  if (coupon.variationIds.length > 0) {
    const hasVariation = ctx.items.some(
      (item) =>
        item.variationId && coupon.variationIds.includes(item.variationId),
    );
    if (!hasVariation) {
      throw new CouponValidationError(
        'PRODUCT',
        'Cupom não válido para as variações selecionadas.',
      );
    }
  }

  if (
    coupon.discountType === 'first-purchase' &&
    (ctx.customerOrderCount ?? 0) > 0
  ) {
    throw new CouponValidationError(
      'FIRST_PURCHASE',
      'Cupom válido apenas para a primeira compra.',
    );
  }
}

export function calculateCouponDiscountAmount(
  coupon: DbCoupon,
  items: CartItemForCoupon[],
  subtotal: number,
): number {
  const rules = parseRules(coupon.rules);
  const value = toNumber(coupon.discountValue);

  if (coupon.discountType === 'free-shipping' || rules.freeShipping) {
    return 0;
  }

  switch (coupon.discountType) {
    case 'percent':
    case 'first-purchase':
    case 'influencer':
    case 'min-order':
      return roundMoney((subtotal * value) / 100);
    case 'fixed':
      return roundMoney(Math.min(subtotal, value));
    case 'category': {
      const slug = rules.categorySlug;
      const categorySubtotal = items
        .filter(
          (item) =>
            (slug && item.categorySlug === slug) ||
            (item.categoryId && coupon.categoryIds.includes(item.categoryId)),
        )
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      return roundMoney((categorySubtotal * value) / 100);
    }
    case 'product': {
      const productIds = [
        ...coupon.productIds,
        ...(rules.productId ? [rules.productId] : []),
      ];
      const productSubtotal = items
        .filter((item) => productIds.includes(item.productId))
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      if (value <= 100) {
        return roundMoney((productSubtotal * value) / 100);
      }
      return roundMoney(Math.min(productSubtotal, value));
    }
    default:
      return roundMoney((subtotal * value) / 100);
  }
}

export function couponGrantsFreeShipping(coupon: DbCoupon): boolean {
  const rules = parseRules(coupon.rules);
  return coupon.discountType === 'free-shipping' || !!rules.freeShipping;
}

export function buildAppliedCouponLabel(coupon: DbCoupon): string {
  const value = toNumber(coupon.discountValue);
  if (coupon.discountType === 'free-shipping') return 'Frete grátis';
  if (coupon.discountType === 'fixed') {
    return `R$ ${value.toFixed(2).replace('.', ',')} de desconto`;
  }
  return `${value}% de desconto`;
}

export async function countCustomerCouponRedemptions(
  couponId: string,
  customerId: string,
  countFn: (couponId: string, customerId: string) => Promise<number>,
  limit?: number | null,
): Promise<void> {
  if (!limit) return;
  const count = await countFn(couponId, customerId);
  if (count >= limit) {
    throw new CouponValidationError(
      'LIMIT_PER_CUSTOMER',
      'Você já utilizou este cupom o máximo de vezes permitido.',
    );
  }
}
