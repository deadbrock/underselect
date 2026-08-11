import {
  MOCK_COUPONS,
  DEFAULT_INSTALLMENT_COUNT,
} from '@shared/constants/cart.constants';
import type {
  AppliedCoupon,
  CartLineItem,
  CartTotals,
  CouponFeedback,
  ShippingQuote,
} from '@shared/types/cart.types';

export function calculateCatalogDiscount(items: CartLineItem[]): number {
  return items.reduce((acc, item) => {
    if (!item.compareAtPrice || item.compareAtPrice <= item.price) return acc;
    return acc + (item.compareAtPrice - item.price) * item.quantity;
  }, 0);
}

export function calculateSubtotal(items: CartLineItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateItemCount(items: CartLineItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export function calculateCouponDiscount(
  items: CartLineItem[],
  subtotal: number,
  coupon: AppliedCoupon | null,
): number {
  if (!coupon || subtotal <= 0) return 0;

  switch (coupon.type) {
    case 'percent':
    case 'first-purchase':
    case 'influencer':
      return (subtotal * coupon.value) / 100;
    case 'fixed':
      return Math.min(subtotal, coupon.value);
    case 'category': {
      const categorySubtotal = items
        .filter((item) => item.category === coupon.category)
        .reduce((acc, item) => acc + item.price * item.quantity, 0);
      return (categorySubtotal * coupon.value) / 100;
    }
    case 'free-shipping':
      return 0;
    default:
      return 0;
  }
}

export function calculateShippingCost(
  quote: ShippingQuote | null,
  coupon: AppliedCoupon | null,
): number {
  if (!quote) return 0;
  if (coupon?.type === 'free-shipping') return 0;
  const selected = quote.options.find(
    (option) => option.id === quote.selectedOptionId,
  );
  return selected?.price ?? 0;
}

export function calculateCartTotals(
  items: CartLineItem[],
  coupon: AppliedCoupon | null,
  shippingQuote: ShippingQuote | null,
): CartTotals {
  const subtotal = calculateSubtotal(items);
  const catalogDiscount = calculateCatalogDiscount(items);
  const couponDiscount = calculateCouponDiscount(items, subtotal, coupon);
  const shipping = calculateShippingCost(shippingQuote, coupon);
  const totalBeforeShipping = Math.max(0, subtotal - couponDiscount);
  const total = Math.max(0, totalBeforeShipping + shipping);
  const installmentCount =
    items.reduce((max, item) => Math.max(max, item.installmentCount), 0) ||
    DEFAULT_INSTALLMENT_COUNT;
  const payableTotal = shippingQuote ? total : totalBeforeShipping;

  return {
    itemCount: calculateItemCount(items),
    subtotal,
    catalogDiscount,
    couponDiscount,
    shipping,
    total,
    totalBeforeShipping,
    installmentCount,
    installmentValue: payableTotal / installmentCount,
  };
}

export function resolveCoupon(code: string): {
  coupon: AppliedCoupon | null;
  feedback: CouponFeedback | null;
} {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return {
      coupon: null,
      feedback: { type: 'invalid', message: 'Informe um cupom válido.' },
    };
  }

  const mock = MOCK_COUPONS[normalized];
  if (!mock) {
    return {
      coupon: null,
      feedback: { type: 'invalid', message: 'Cupom inválido ou inexistente.' },
    };
  }

  if (mock.expired) {
    return {
      coupon: null,
      feedback: { type: 'expired', message: 'Este cupom está expirado.' },
    };
  }

  return {
    coupon: {
      code: mock.code,
      type: mock.type,
      value: mock.value,
      label: mock.label,
      category: mock.category,
    },
    feedback: {
      type: 'success',
      message: `Cupom ${mock.code} aplicado — ${mock.label}.`,
    },
  };
}
