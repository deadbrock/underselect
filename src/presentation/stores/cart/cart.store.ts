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
import { calculateSubtotal } from './cart.utils';
import { validateCouponApi } from '@presentation/stores/admin/marketing/marketing.api';
import { fetchShippingQuote } from '@presentation/stores/shipping/shipping.api';
import type { CouponType } from '@shared/types/cart.types';

interface CartState {
  items: CartLineItem[];
  appliedCoupon: AppliedCoupon | null;
  couponFeedback: CouponFeedback | null;
  shippingCep: string;
  shippingQuote: ShippingQuote | null;
  shippingLoading: boolean;
  isDrawerOpen: boolean;
  lastAddedLineId: string | null;
}

interface CartActions {
  addItem: (input: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  applyCoupon: (code: string, customerCpf?: string) => Promise<void>;
  removeCoupon: () => void;
  clearCouponFeedback: () => void;
  setShippingCep: (cep: string) => void;
  calculateShipping: (cep: string) => Promise<void>;
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
      shippingLoading: false,
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
          shippingCep: '',
          shippingQuote: null,
          lastAddedLineId: null,
        });
      },

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      applyCoupon: async (code, customerCpf) => {
        const items = get().items.map((item) => ({
          productId: item.productId,
          variationId: item.modelId || undefined,
          categorySlug: item.category,
          quantity: item.quantity,
          unitPrice: item.price,
        }));

        try {
          const result = await validateCouponApi({
            code,
            items,
            customerCpf,
          });

          if (!result.valid || !result.coupon) {
            set({
              appliedCoupon: null,
              couponFeedback: {
                type:
                  result.feedback.type === 'expired' ? 'expired' : 'invalid',
                message: result.feedback.message,
              },
            });
            return;
          }

          set({
            appliedCoupon: {
              id: result.coupon.id,
              code: result.coupon.code,
              type: result.coupon.type as CouponType,
              value: result.coupon.value,
              label: result.coupon.label,
              category: result.coupon.category as AppliedCoupon['category'],
            },
            couponFeedback: {
              type: 'success',
              message: result.feedback.message,
            },
          });

          const shippingCep = get().shippingCep;
          if (shippingCep.replace(/\D/g, '').length === 8) {
            void get().calculateShipping(shippingCep);
          }
        } catch (error) {
          set({
            appliedCoupon: null,
            couponFeedback: {
              type: 'invalid',
              message:
                error instanceof Error
                  ? error.message
                  : 'Não foi possível validar o cupom.',
            },
          });
        }
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponFeedback: null,
        });
      },

      clearCouponFeedback: () => set({ couponFeedback: null }),

      setShippingCep: (cep) => set({ shippingCep: cep }),

      calculateShipping: async (cep) => {
        const items = get().items;
        if (items.length === 0) {
          set({ shippingQuote: null, shippingCep: cep });
          return;
        }

        set({ shippingLoading: true, shippingCep: cep });

        try {
          const quote = await fetchShippingQuote({
            destinationCep: cep,
            subtotal: calculateSubtotal(items),
            couponCode: get().appliedCoupon?.code,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          });

          set({ shippingQuote: quote });
        } catch (error) {
          set({ shippingQuote: null });
          if (error instanceof Error) throw error;
          throw new Error('Não foi possível calcular o frete.');
        } finally {
          set({ shippingLoading: false });
        }
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
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<CartState> | undefined;
        return {
          ...current,
          ...saved,
          shippingQuote: null,
        };
      },
    },
  ),
);
