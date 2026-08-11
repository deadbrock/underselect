import type {
  CepLookupResult,
  CheckoutPaymentIntent,
  CheckoutPaymentPayload,
} from '@shared/types/checkout.types';

import { normalizeCep } from '../cart/cart.helpers';

/** Placeholder até integração com ViaCEP ou serviço equivalente. */
export function mockCepLookup(cep: string): CepLookupResult | null {
  const normalized = normalizeCep(cep);
  if (normalized.length !== 8) return null;
  return null;
}

/** Placeholder até integração com InfinitePay. */
export async function mockCreatePaymentIntent(
  payload: CheckoutPaymentPayload,
): Promise<CheckoutPaymentIntent> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    provider: 'infinitepay',
    intentId: `ip_${payload.orderId}`,
    status: 'pending',
  };
}

export function generateOrderId(): string {
  return `US-${Date.now().toString(36).toUpperCase()}`;
}
