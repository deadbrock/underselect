function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }
  return value;
}

import { resolveAppBaseUrl } from '@shared/utils/app-url.utils';

function readAppBaseUrl(baseUrl?: string): string {
  if (baseUrl?.trim()) {
    return baseUrl.trim().replace(/\/$/, '');
  }
  return resolveAppBaseUrl();
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

export function getInfinitePayRedirectUrl(baseUrl?: string): string {
  const override = process.env.INFINITEPAY_REDIRECT_URL?.trim();
  if (override) return override;
  return `${readAppBaseUrl(baseUrl)}/checkout/retorno`;
}

export function getInfinitePayWebhookUrl(baseUrl?: string): string {
  const override = process.env.INFINITEPAY_WEBHOOK_URL?.trim();
  if (override) return override;
  return `${readAppBaseUrl(baseUrl)}/api/webhooks/infinitepay`;
}

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return Math.round(cents) / 100;
}
