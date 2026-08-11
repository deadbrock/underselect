import type { ShippingQuote } from '@shared/types/cart.types';
import type { CepLookupResult } from '@shared/types/checkout.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message ?? 'Falha na requisição.');
  }
  return payload.data;
}

export async function fetchCepLookup(cep: string): Promise<CepLookupResult> {
  const normalized = cep.replace(/\D/g, '');
  const response = await fetch(`/api/shipping/cep/${normalized}`, {
    cache: 'no-store',
  });
  return parseApiResponse<CepLookupResult>(response);
}

export interface ShippingQuoteRequest {
  destinationCep: string;
  subtotal: number;
  couponCode?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export async function fetchShippingQuote(
  input: ShippingQuoteRequest,
): Promise<ShippingQuote> {
  const response = await fetch('/api/shipping/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<ShippingQuote>(response);
}
