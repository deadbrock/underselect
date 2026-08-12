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

export interface CustomerSessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
}

export async function customerLoginApi(input: {
  email: string;
  password: string;
}) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ user: CustomerSessionUser }>(response);
}

export async function customerLogoutApi() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  return parseApiResponse<{ success: boolean }>(response);
}

export async function fetchCustomerSessionApi() {
  const response = await fetch('/api/auth/session', {
    cache: 'no-store',
  });

  return parseApiResponse<{ user: CustomerSessionUser }>(response);
}

export async function changeCustomerPasswordApi(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ success: boolean; requiresLogin: boolean }>(
    response,
  );
}
