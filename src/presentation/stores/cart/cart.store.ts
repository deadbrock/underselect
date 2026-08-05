'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CART_STORAGE_KEY } from '@shared/constants/cart.constants';
import type {
  AddCartItemInput,
  AppliedCoupon,
  CartLineItem,
  CouponFeedback,
  ShippingQuote,
} from '@shared/types/cart.types';

import { createCartLineItem } from './cart.helpers';
import { mockShippingQuote, resolveCoupon } from './cart.utils';

interface CartState {
  items: CartLineItem[];
  appliedCoupon: AppliedCoupon | null;
  couponFeedback: CouponFeedback | null;
  shippingCep: string;
  shippingQuote: ShippingQuote | null;
  isDrawerOpen: boolean;
  lastAddedLineId: string | null;
}

interface CartActions {
  addItem: (input: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  clearCouponFeedback: () => void;
  setShippingCep: (cep: string) => void;
  calculateShipping: (cep: string) => void;
  selectShippingOption: (optionId: string) => void;
  saveForLater: (lineId: string) => void;
}

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponFeedback: null,
      shippingCep: '',
      shippingQuote: null,
      isDrawerOpen: false,
      lastAddedLineId: null,

      addItem: (input) => {
        const line = createCartLineItem(input);
        const existing = get().items.find(
          (item) => item.lineId === line.lineId,
        );

        set((state) => ({
          items: existing
            ? state.items.map((item) =>
                item.lineId === line.lineId
                  ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
                  : item,
              )
            : [...state.items, line],
          isDrawerOpen: true,
          lastAddedLineId: line.lineId,
        }));
      },

      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
          lastAddedLineId:
            state.lastAddedLineId === lineId ? null : state.lastAddedLineId,
        }));
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity < 1) {
          get().removeItem(lineId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          appliedCoupon: null,
          couponFeedback: null,
          shippingQuote: null,
          lastAddedLineId: null,
        });
      },

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      applyCoupon: (code) => {
        const { coupon, feedback } = resolveCoupon(code);
        set({
          appliedCoupon: coupon,
          couponFeedback: feedback,
        });
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponFeedback: null,
        });
      },

      clearCouponFeedback: () => set({ couponFeedback: null }),

      setShippingCep: (cep) => set({ shippingCep: cep }),

      calculateShipping: (cep) => {
        const quote = mockShippingQuote(cep);
        set({
          shippingCep: cep,
          shippingQuote: quote,
        });
      },

      selectShippingOption: (optionId) => {
        const quote = get().shippingQuote;
        if (!quote) return;
        set({
          shippingQuote: { ...quote, selectedOptionId: optionId },
        });
      },

      saveForLater: (_lineId) => {
        // Estrutura preparada para integração com lista de desejos / backend
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        shippingCep: state.shippingCep,
        shippingQuote: state.shippingQuote,
      }),
    },
  ),
);
