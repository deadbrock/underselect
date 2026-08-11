import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import { UnauthorizedError } from '@application/errors';
import {
  signAdminSessionToken,
  verifyAdminSessionToken,
} from '@infrastructure/auth/admin-session-token';
import {
  createAdminSession,
  deleteAdminSession,
  deleteAllAdminSessionsForUser,
  deleteExpiredAdminSessions,
  findAdminUserByEmail,
  findAdminUserById,
  findValidAdminSession,
  updateAdminUserLastLogin,
  updateAdminUserPassword,
  updateAdminUserProfile,
} from '@infrastructure/database/repositories/admin-user.repository';
import {
  getAdminSessionCookieName,
  getAdminSessionExpiresAt,
  getAdminSessionMaxAgeSeconds,
  isProduction,
} from '@shared/config/auth.config';

const BCRYPT_ROUNDS = 12;

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

function mapAdminUser(user: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}): AdminSessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}

export async function hashAdminPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyAdminPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

function buildSessionCookie(token: string) {
  return {
    name: getAdminSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: getAdminSessionMaxAgeSeconds(),
  };
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(buildSessionCookie(token));
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: getAdminSessionCookieName(),
    value: '',
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function readAdminSessionTokenFromCookies(): Promise<
  string | null
> {
  const cookieStore = await cookies();
  return cookieStore.get(getAdminSessionCookieName())?.value ?? null;
}

export async function readAdminSessionTokenFromRequest(
  request: Request,
): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookieName = `${getAdminSessionCookieName()}=`;
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName));

  if (!match) return null;
  return decodeURIComponent(match.slice(cookieName.length));
}

export async function loginAdmin(input: {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<AdminSessionUser> {
  await deleteExpiredAdminSessions();

  const user = await findAdminUserByEmail(input.email);

  if (!user || !user.isActive) {
    throw new AdminAuthError('E-mail ou senha inválidos.');
  }

  const passwordMatches = await verifyAdminPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AdminAuthError('E-mail ou senha inválidos.');
  }

  const expiresAt = getAdminSessionExpiresAt();
  const session = await createAdminSession({
    userId: user.id,
    expiresAt,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  const token = await signAdminSessionToken(user.id, session.id);
  await setAdminSessionCookie(token);
  await updateAdminUserLastLogin(user.id);

  return mapAdminUser(user);
}

export async function logoutAdmin(token?: string | null): Promise<void> {
  const resolvedToken = token ?? (await readAdminSessionTokenFromCookies());
  if (resolvedToken) {
    const payload = await verifyAdminSessionToken(resolvedToken);
    if (payload) {
      await deleteAdminSession(payload.sid);
    }
  }

  await clearAdminSessionCookie();
}

export async function getAdminSessionUser(
  token?: string | null,
): Promise<AdminSessionUser | null> {
  const resolvedToken =
    token ?? (await readAdminSessionTokenFromCookies()) ?? null;

  if (!resolvedToken) return null;

  const payload = await verifyAdminSessionToken(resolvedToken);
  if (!payload) return null;

  const session = await findValidAdminSession(payload.sid);
  if (!session || session.userId !== payload.sub) return null;

  return mapAdminUser(session.user);
}

export async function requireAdminSession(
  request?: Request,
): Promise<AdminSessionUser> {
  const token = request
    ? await readAdminSessionTokenFromRequest(request)
    : await readAdminSessionTokenFromCookies();

  const user = await getAdminSessionUser(token);
  if (!user) {
    throw new UnauthorizedError('Sessão administrativa inválida ou expirada.');
  }

  return user;
}

export async function changeAdminPassword(input: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const user = await findAdminUserById(input.userId);
  if (!user || !user.isActive) {
    throw new AdminAuthError('Usuário administrativo não encontrado.');
  }

  const passwordMatches = await verifyAdminPassword(
    input.currentPassword,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AdminAuthError('Senha atual incorreta.');
  }

  if (input.currentPassword === input.newPassword) {
    throw new AdminAuthError('A nova senha deve ser diferente da senha atual.');
  }

  const passwordHash = await hashAdminPassword(input.newPassword);
  await updateAdminUserPassword(user.id, passwordHash);
  await deleteAllAdminSessionsForUser(user.id);
  await clearAdminSessionCookie();
}

export async function updateAdminProfile(input: {
  userId: string;
  name: string;
  email: string;
  phone?: string;
}): Promise<AdminSessionUser> {
  const user = await findAdminUserById(input.userId);
  if (!user || !user.isActive) {
    throw new AdminAuthError('Usuário administrativo não encontrado.');
  }

  const normalizedEmail = input.email.toLowerCase().trim();
  if (normalizedEmail !== user.email) {
    const existing = await findAdminUserByEmail(normalizedEmail);
    if (existing && existing.id !== user.id) {
      throw new AdminAuthError('Este e-mail já está em uso.');
    }
  }

  const updated = await updateAdminUserProfile(user.id, {
    name: input.name,
    email: normalizedEmail,
    phone: input.phone,
  });

  return mapAdminUser(updated);
}

export async function verifyAdminSessionTokenValue(
  token: string,
): Promise<boolean> {
  const payload = await verifyAdminSessionToken(token);
  if (!payload) return false;

  const session = await findValidAdminSession(payload.sid);
  return Boolean(session && session.userId === payload.sub);
}
