import type { AdminStoreSettings } from '@shared/types/admin-settings.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Falha ao comunicar com a API.');
  }

  return payload.data;
}

export async function fetchStoreSettings(): Promise<AdminStoreSettings> {
  const response = await fetch('/api/admin/settings', {
    method: 'GET',
    cache: 'no-store',
  });

  return parseApiResponse<AdminStoreSettings>(response);
}

export async function saveStoreSettings(
  settings: AdminStoreSettings,
): Promise<AdminStoreSettings> {
  const response = await fetch('/api/admin/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  return parseApiResponse<AdminStoreSettings>(response);
}

export async function resetStoreSettingsApi(): Promise<AdminStoreSettings> {
  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reset' }),
  });

  return parseApiResponse<AdminStoreSettings>(response);
}
