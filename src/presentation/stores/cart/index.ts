import { useMemo } from 'react';

import type { CartTotals } from '@shared/types/cart.types';

import { useCartStore } from './cart.store';
import { calculateCartTotals } from './cart.utils';

export function useCartTotals(): CartTotals {
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const shippingQuote = useCartStore((state) => state.shippingQuote);

  return useMemo(
    () => calculateCartTotals(items, appliedCoupon, shippingQuote),
    [items, appliedCoupon, shippingQuote],
  );
}

export function useCartItemCount(): number {
  return useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );
}

export { useCartStore, type CartStore } from './cart.store';
export {
  catalogProductToCartInput,
  productDetailToCartInput,
  formatCartVariant,
  formatCep,
  normalizeCep,
} from './cart.helpers';
export { calculateCartTotals } from './cart.utils';
