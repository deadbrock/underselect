function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }
  return value;
}

function readAppBaseUrl(): string {
  return (
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export function getInfinitePayHandle(): string {
  return readRequiredEnv('INFINITEPAY_HANDLE').replace(/^\$/, '');
}

export function getInfinitePayApiBaseUrl(): string {
  return (
    process.env.INFINITEPAY_API_BASE_URL?.trim() ||
    'https://api.checkout.infinitepay.io'
  ).replace(/\/$/, '');
}

export function getInfinitePayRedirectUrl(): string {
  const override = process.env.INFINITEPAY_REDIRECT_URL?.trim();
  if (override) return override;
  return `${readAppBaseUrl()}/checkout/retorno`;
}

export function getInfinitePayWebhookUrl(): string {
  const override = process.env.INFINITEPAY_WEBHOOK_URL?.trim();
  if (override) return override;
  return `${readAppBaseUrl()}/api/webhooks/infinitepay`;
}

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return Math.round(cents) / 100;
}
