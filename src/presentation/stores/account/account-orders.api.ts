import type { AccountOrder } from '@shared/types/account.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message ?? 'Erro ao comunicar com a API.');
  }
  return payload.data;
}

export async function fetchAccountOrdersApi() {
  const response = await fetch('/api/account/orders', { cache: 'no-store' });
  return parseApiResponse<AccountOrder[]>(response);
}

export async function fetchAccountOrderByIdApi(orderId: string) {
  const response = await fetch(`/api/account/orders/${orderId}`, {
    cache: 'no-store',
  });
  return parseApiResponse<AccountOrder>(response);
}
