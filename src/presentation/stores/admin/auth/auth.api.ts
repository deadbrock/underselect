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

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

export async function adminLoginApi(input: {
  email: string;
  password: string;
}) {
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ user: AdminSessionUser }>(response);
}

export async function adminLogoutApi() {
  const response = await fetch('/api/admin/auth/logout', {
    method: 'POST',
  });

  return parseApiResponse<{ success: boolean }>(response);
}

export async function fetchAdminSessionApi() {
  const response = await fetch('/api/admin/auth/session', {
    cache: 'no-store',
  });

  return parseApiResponse<{ user: AdminSessionUser }>(response);
}

export async function updateAdminProfileApi(input: {
  name: string;
  email: string;
  phone?: string;
}) {
  const response = await fetch('/api/admin/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ user: AdminSessionUser }>(response);
}

export async function changeAdminPasswordApi(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/admin/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ success: boolean; requiresLogin: boolean }>(
    response,
  );
}
