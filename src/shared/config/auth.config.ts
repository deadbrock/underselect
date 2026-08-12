const ADMIN_SESSION_COOKIE_NAME = 'admin_session';
const CUSTOMER_SESSION_COOKIE_NAME = 'customer_session';
const SESSION_DURATION_DAYS = 7;

const ACCOUNT_PROTECTED_PATHS = [
  '/minha-conta',
  '/pedidos',
  '/enderecos',
  '/dados-pessoais',
  '/alterar-senha',
  '/favoritos',
  '/lista-desejos',
  '/cupons',
  '/configuracoes',
] as const;

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }
  return value;
}

export function getAuthSecret(): string {
  return readRequiredEnv('AUTH_SECRET');
}

export function getAdminSessionCookieName(): string {
  return ADMIN_SESSION_COOKIE_NAME;
}

export function getCustomerSessionCookieName(): string {
  return CUSTOMER_SESSION_COOKIE_NAME;
}

export function getSessionMaxAgeSeconds(): number {
  return SESSION_DURATION_DAYS * 24 * 60 * 60;
}

export function getAdminSessionMaxAgeSeconds(): number {
  return getSessionMaxAgeSeconds();
}

export function getCustomerSessionMaxAgeSeconds(): number {
  return getSessionMaxAgeSeconds();
}

export function getAdminSessionExpiresAt(): Date {
  return new Date(Date.now() + getAdminSessionMaxAgeSeconds() * 1000);
}

export function getCustomerSessionExpiresAt(): Date {
  return new Date(Date.now() + getCustomerSessionMaxAgeSeconds() * 1000);
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isAccountProtectedPath(pathname: string): boolean {
  return ACCOUNT_PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export { ACCOUNT_PROTECTED_PATHS };
