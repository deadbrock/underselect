import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import { UnauthorizedError } from '@application/errors';
import {
  signCustomerSessionToken,
  verifyCustomerSessionToken,
} from '@infrastructure/auth/customer-session-token';
import {
  createCustomerSession,
  deleteAllCustomerSessions,
  deleteCustomerSession,
  deleteExpiredCustomerSessions,
  findCustomerByEmail,
  findCustomerById,
  findValidCustomerSession,
  updateCustomerLastLogin,
  updateCustomerPassword,
} from '@infrastructure/database/repositories/customer-auth.repository';
import {
  getCustomerSessionCookieName,
  getCustomerSessionExpiresAt,
  getCustomerSessionMaxAgeSeconds,
  isProduction,
} from '@shared/config/auth.config';

const BCRYPT_ROUNDS = 12;

export class CustomerAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerAuthError';
  }
}

export interface CustomerSessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
}

function mapCustomerUser(customer: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
}): CustomerSessionUser {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    cpf: customer.cpf,
    phone: customer.phone,
  };
}

export async function hashCustomerPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyCustomerPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

function buildSessionCookie(token: string) {
  return getCustomerSessionCookieOptions(token);
}

export function getCustomerSessionCookieOptions(token: string) {
  return {
    name: getCustomerSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: getCustomerSessionMaxAgeSeconds(),
  };
}

export async function setCustomerSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(buildSessionCookie(token));
}

export async function clearCustomerSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: getCustomerSessionCookieName(),
    value: '',
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function readCustomerSessionTokenFromCookies(): Promise<
  string | null
> {
  const cookieStore = await cookies();
  return cookieStore.get(getCustomerSessionCookieName())?.value ?? null;
}

export async function readCustomerSessionTokenFromRequest(
  request: Request,
): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookieName = `${getCustomerSessionCookieName()}=`;
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName));

  if (!match) return null;
  return decodeURIComponent(match.slice(cookieName.length));
}

export async function loginCustomer(input: {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<{ user: CustomerSessionUser; token: string }> {
  await deleteExpiredCustomerSessions();

  const customer = await findCustomerByEmail(input.email);

  if (!customer || customer.status !== 'active' || !customer.passwordHash) {
    throw new CustomerAuthError('E-mail ou senha inválidos.');
  }

  const passwordMatches = await verifyCustomerPassword(
    input.password,
    customer.passwordHash,
  );

  if (!passwordMatches) {
    throw new CustomerAuthError('E-mail ou senha inválidos.');
  }

  const expiresAt = getCustomerSessionExpiresAt();
  const session = await createCustomerSession({
    customerId: customer.id,
    expiresAt,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  const token = await signCustomerSessionToken(customer.id, session.id);
  await updateCustomerLastLogin(customer.id);

  return { user: mapCustomerUser(customer), token };
}

export async function logoutCustomer(token?: string | null): Promise<void> {
  const resolvedToken = token ?? (await readCustomerSessionTokenFromCookies());
  if (resolvedToken) {
    const payload = await verifyCustomerSessionToken(resolvedToken);
    if (payload) {
      await deleteCustomerSession(payload.sid);
    }
  }

  await clearCustomerSessionCookie();
}

export async function getCustomerSessionUser(
  token?: string | null,
): Promise<CustomerSessionUser | null> {
  const resolvedToken =
    token ?? (await readCustomerSessionTokenFromCookies()) ?? null;

  if (!resolvedToken) return null;

  const payload = await verifyCustomerSessionToken(resolvedToken);
  if (!payload) return null;

  const session = await findValidCustomerSession(payload.sid);
  if (!session || session.customerId !== payload.sub) return null;

  return mapCustomerUser(session.customer);
}

export async function requireCustomerSession(
  request?: Request,
): Promise<CustomerSessionUser> {
  const token = request
    ? await readCustomerSessionTokenFromRequest(request)
    : await readCustomerSessionTokenFromCookies();

  const user = await getCustomerSessionUser(token);
  if (!user) {
    throw new UnauthorizedError('Sessão inválida ou expirada.');
  }

  return user;
}

export async function changeCustomerPassword(input: {
  customerId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const customer = await findCustomerById(input.customerId);
  if (!customer || customer.status !== 'active' || !customer.passwordHash) {
    throw new CustomerAuthError('Conta não encontrada.');
  }

  const passwordMatches = await verifyCustomerPassword(
    input.currentPassword,
    customer.passwordHash,
  );

  if (!passwordMatches) {
    throw new CustomerAuthError('Senha atual incorreta.');
  }

  if (input.currentPassword === input.newPassword) {
    throw new CustomerAuthError(
      'A nova senha deve ser diferente da senha atual.',
    );
  }

  const passwordHash = await hashCustomerPassword(input.newPassword);
  await updateCustomerPassword(customer.id, passwordHash);
  await deleteAllCustomerSessions(customer.id);
  await clearCustomerSessionCookie();
}

export async function verifyCustomerSessionTokenValue(
  token: string,
): Promise<boolean> {
  const payload = await verifyCustomerSessionToken(token);
  if (!payload) return false;

  const session = await findValidCustomerSession(payload.sid);
  return Boolean(session && session.customerId === payload.sub);
}
