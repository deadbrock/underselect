'use client';

import { create } from 'zustand';

import type {
  CheckoutOrderResult,
  CheckoutPaymentPayload,
  PaymentMethod,
} from '@shared/types/checkout.types';

import { generateOrderId, mockCreatePaymentIntent } from './checkout.utils';

interface CheckoutState {
  paymentMethod: PaymentMethod;
  cardInstallments: number;
  isProcessing: boolean;
  orderResult: CheckoutOrderResult | null;
}

interface CheckoutActions {
  setPaymentMethod: (method: PaymentMethod) => void;
  setCardInstallments: (installments: number) => void;
  submitOrder: (
    payload: CheckoutPaymentPayload,
  ) => Promise<CheckoutOrderResult>;
  resetCheckout: () => void;
}

export type CheckoutStore = CheckoutState & CheckoutActions;

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  paymentMethod: 'pix',
  cardInstallments: 1,
  isProcessing: false,
  orderResult: null,

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setCardInstallments: (installments) =>
    set({ cardInstallments: installments }),

  submitOrder: async (payload) => {
    set({ isProcessing: true });

    try {
      await mockCreatePaymentIntent(payload);

      const result: CheckoutOrderResult = {
        orderId: payload.orderId,
        paymentMethod: payload.paymentMethod,
        total: payload.amount,
        createdAt: new Date().toISOString(),
      };

      set({ orderResult: result, isProcessing: false });
      return result;
    } catch {
      set({ isProcessing: false });
      throw new Error('Não foi possível finalizar o pedido.');
    }
  },

  resetCheckout: () =>
    set({
      paymentMethod: 'pix',
      cardInstallments: 1,
      isProcessing: false,
      orderResult: null,
    }),
}));

export { generateOrderId };
