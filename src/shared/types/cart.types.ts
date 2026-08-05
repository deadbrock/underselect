import type { CatalogCategorySlug } from '@shared/mocks/catalog.types';

export interface CartLineItem {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  categoryLabel: string;
  category: CatalogCategorySlug;
  team?: string;
  selection?: string;
  size: string;
  colorId: string;
  colorLabel: string;
  modelId: string;
  modelLabel: string;
  price: number;
  compareAtPrice?: number;
  installmentCount: number;
  quantity: number;
}

export interface AddCartItemInput {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  categoryLabel: string;
  category: CatalogCategorySlug;
  team?: string;
  selection?: string;
  size: string;
  colorId: string;
  colorLabel: string;
  modelId: string;
  modelLabel: string;
  price: number;
  compareAtPrice?: number;
  installmentCount: number;
  quantity?: number;
}

export type CouponType =
  | 'percent'
  | 'fixed'
  | 'first-purchase'
  | 'free-shipping'
  | 'category'
  | 'influencer';

export interface MockCoupon {
  code: string;
  type: CouponType;
  value: number;
  label: string;
  category?: CatalogCategorySlug;
  expired?: boolean;
}

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  label: string;
  category?: CatalogCategorySlug;
}

export type CouponFeedbackType = 'success' | 'invalid' | 'expired';

export interface CouponFeedback {
  type: CouponFeedbackType;
  message: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  days: string;
  price: number;
}

export interface ShippingQuote {
  cep: string;
  options: ShippingOption[];
  selectedOptionId: string;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  catalogDiscount: number;
  couponDiscount: number;
  shipping: number;
  total: number;
  installmentCount: number;
  installmentValue: number;
}
