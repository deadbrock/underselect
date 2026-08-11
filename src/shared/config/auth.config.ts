const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION_DAYS = 7;

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
  return SESSION_COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds(): number {
  return SESSION_DURATION_DAYS * 24 * 60 * 60;
}

export function getAdminSessionExpiresAt(): Date {
  return new Date(Date.now() + getAdminSessionMaxAgeSeconds() * 1000);
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
