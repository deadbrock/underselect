import type {
  AdminShippingConfig,
  ShippingCalculationBreakdown,
  ShippingDistanceRange,
  ShippingDistanceRangeInput,
} from '@shared/types/shipping-config.types';

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

export async function fetchShippingConfig(): Promise<AdminShippingConfig> {
  const response = await fetch('/api/admin/settings/shipping', {
    cache: 'no-store',
  });
  return parseApiResponse<AdminShippingConfig>(response);
}

export type UpdateShippingConfigInput = Pick<
  AdminShippingConfig,
  | 'shippingBaseFee'
  | 'shippingPerKm'
  | 'shippingMinFee'
  | 'shippingMaxFee'
  | 'freeShippingEnabled'
  | 'freeShippingMinValue'
  | 'distanceCalculationEnabled'
  | 'distanceRangesEnabled'
>;

export async function saveShippingConfigApi(input: UpdateShippingConfigInput) {
  const response = await fetch('/api/admin/settings/shipping', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminShippingConfig>(response);
}

export async function createShippingRangeApi(
  input: ShippingDistanceRangeInput,
) {
  const response = await fetch('/api/admin/settings/shipping/ranges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<ShippingDistanceRange>(response);
}

export async function updateShippingRangeApi(
  id: string,
  input: ShippingDistanceRangeInput,
) {
  const response = await fetch(`/api/admin/settings/shipping/ranges/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<ShippingDistanceRange>(response);
}

export async function deleteShippingRangeApi(id: string) {
  const response = await fetch(`/api/admin/settings/shipping/ranges/${id}`, {
    method: 'DELETE',
  });
  return parseApiResponse<{ deleted: boolean }>(response);
}

export async function previewShippingCalculationApi(input: {
  destinationCep: string;
  subtotal: number;
  couponCode?: string;
}) {
  const response = await fetch('/api/admin/settings/shipping/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<{
    quote: unknown;
    breakdown: ShippingCalculationBreakdown;
  }>(response);
}
