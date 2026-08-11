'use client';

import { create } from 'zustand';

import { createCheckoutOrderApi } from '@presentation/stores/payments/payments.api';
import type {
  CheckoutOrderResult,
  CheckoutPaymentPayload,
  PaymentMethod,
} from '@shared/types/checkout.types';

interface CheckoutOrderPayload extends CheckoutPaymentPayload {
  items: {
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
    categorySlug?: string;
  }[];
  shippingMethod?: string;
  couponCode?: string;
}

interface CheckoutState {
  paymentMethod: PaymentMethod;
  cardInstallments: number;
  isProcessing: boolean;
  isRedirecting: boolean;
  orderResult: CheckoutOrderResult | null;
}

interface CheckoutActions {
  setPaymentMethod: (method: PaymentMethod) => void;
  setCardInstallments: (installments: number) => void;
  submitOrder: (payload: CheckoutOrderPayload) => Promise<CheckoutOrderResult>;
  resetCheckout: () => void;
}

export type CheckoutStore = CheckoutState & CheckoutActions;

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  paymentMethod: 'pix',
  cardInstallments: 1,
  isProcessing: false,
  isRedirecting: false,
  orderResult: null,

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setCardInstallments: (installments) =>
    set({ cardInstallments: installments }),

  submitOrder: async (payload) => {
    set({ isProcessing: true, isRedirecting: false });

    try {
      const created = await createCheckoutOrderApi({
        customer: payload.customer,
        items: payload.items,
        shippingAddress: payload.address,
        shippingMethod: payload.shippingMethod,
        paymentMethod: payload.paymentMethod,
        couponCode: payload.couponCode,
      });

      set({ isRedirecting: true });

      window.location.assign(created.checkoutUrl);

      return {
        orderId: created.orderNumber,
        paymentMethod: payload.paymentMethod,
        total: created.total,
        createdAt: created.createdAt,
        checkoutUrl: created.checkoutUrl,
      };
    } catch (error) {
      set({ isProcessing: false, isRedirecting: false });
      throw error instanceof Error
        ? error
        : new Error('Não foi possível iniciar o pagamento.');
    }
  },

  resetCheckout: () =>
    set({
      paymentMethod: 'pix',
      cardInstallments: 1,
      isProcessing: false,
      isRedirecting: false,
      orderResult: null,
    }),
}));

export { generateOrderId } from './checkout.utils';
