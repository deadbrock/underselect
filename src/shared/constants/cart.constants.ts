import type { MockCoupon } from '@shared/types/cart.types';

export const CART_STORAGE_KEY = 'underselect-cart';

export const MOCK_COUPONS: Record<string, MockCoupon> = {
  UNDER10: {
    code: 'UNDER10',
    type: 'percent',
    value: 10,
    label: '10% de desconto',
  },
  ECONOMIZE50: {
    code: 'ECONOMIZE50',
    type: 'fixed',
    value: 50,
    label: 'R$ 50 de desconto',
  },
  BEMVINDO: {
    code: 'BEMVINDO',
    type: 'first-purchase',
    value: 15,
    label: '15% na primeira compra',
  },
  FRETEGRATIS: {
    code: 'FRETEGRATIS',
    type: 'free-shipping',
    value: 0,
    label: 'Frete grátis',
  },
  FLAMENGO15: {
    code: 'FLAMENGO15',
    type: 'category',
    value: 15,
    category: 'clubes-brasileiros',
    label: '15% em clubes brasileiros',
  },
  INFLUENCER20: {
    code: 'INFLUENCER20',
    type: 'influencer',
    value: 20,
    label: '20% cupom influencer',
  },
  EXPIRADO: {
    code: 'EXPIRADO',
    type: 'percent',
    value: 20,
    label: 'Cupom expirado',
    expired: true,
  },
};

export const DEFAULT_INSTALLMENT_COUNT = 6;
