import type { AdminOrder } from '@shared/types/order-admin.types';

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

export async function fetchAdminOrdersApi(filters?: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.limit !== undefined) params.set('limit', String(filters.limit));
  if (filters?.offset !== undefined) {
    params.set('offset', String(filters.offset));
  }

  const query = params.toString();
  const response = await fetch(`/api/admin/orders${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });

  return parseApiResponse<{ records: AdminOrder[]; total: number }>(response);
}

export async function fetchAdminOrderByIdApi(orderId: string) {
  const response = await fetch(`/api/admin/orders/${orderId}`, {
    cache: 'no-store',
  });

  return parseApiResponse<AdminOrder>(response);
}
