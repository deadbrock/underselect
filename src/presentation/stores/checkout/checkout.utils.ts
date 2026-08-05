import type {
  CepLookupResult,
  CheckoutPaymentIntent,
  CheckoutPaymentPayload,
} from '@shared/types/checkout.types';

import { normalizeCep } from '../cart/cart.helpers';

const CEP_MOCKS: Record<string, CepLookupResult> = {
  '01310100': {
    street: 'Av. Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  },
  '20040020': {
    street: 'Praça Pio X',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  '30130100': {
    street: 'Av. Afonso Pena',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG',
  },
};

export function mockCepLookup(cep: string): CepLookupResult | null {
  const normalized = normalizeCep(cep);
  if (normalized.length !== 8) return null;

  return (
    CEP_MOCKS[normalized] ?? {
      street: 'Rua Exemplo',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    }
  );
}

/** Simula criação de intent InfinitePay — integração futura */
export async function mockCreatePaymentIntent(
  payload: CheckoutPaymentPayload,
): Promise<CheckoutPaymentIntent> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const base: CheckoutPaymentIntent = {
    provider: 'infinitepay',
    intentId: `ip_${payload.orderId}`,
    status: 'succeeded',
  };

  switch (payload.paymentMethod) {
    case 'pix':
      return {
        ...base,
        pixQrCode: '00020126580014BR.GOV.BCB.PIX0136mock-underselect-pix',
      };
    case 'boleto':
      return {
        ...base,
        boletoUrl: `https://pay.infinitepay.mock/boleto/${payload.orderId}`,
      };
    case 'card':
    default:
      return base;
  }
}

export function generateOrderId(): string {
  return `US-${Date.now().toString(36).toUpperCase()}`;
}
