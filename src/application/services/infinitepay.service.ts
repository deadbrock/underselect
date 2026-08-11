import {
  getInfinitePayApiBaseUrl,
  getInfinitePayHandle,
} from '@shared/config/infinitepay.config';

export interface InfinitePayCheckoutItem {
  quantity: number;
  price: number;
  description: string;
}

export interface InfinitePayCustomer {
  name: string;
  email: string;
  phone_number: string;
}

export interface InfinitePayAddress {
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement?: string;
}

export interface CreateInfinitePayLinkInput {
  orderNsu: string;
  items: InfinitePayCheckoutItem[];
  redirectUrl: string;
  webhookUrl: string;
  customer?: InfinitePayCustomer;
  address?: InfinitePayAddress;
}

export interface InfinitePayLinkResponse {
  url: string;
}

export interface InfinitePayPaymentCheckInput {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}

export interface InfinitePayPaymentCheckResponse {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
}

export interface InfinitePayWebhookPayload {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments?: number;
  capture_method: string;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url?: string;
  items?: InfinitePayCheckoutItem[];
}

export class InfinitePayApiError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'InfinitePayApiError';
  }
}

async function postJson<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const baseUrl = getInfinitePayApiBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    T | { message?: string; error?: string } | null;

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === 'object' &&
        ('message' in payload
          ? payload.message
          : 'error' in payload
            ? payload.error
            : undefined)) ||
      `InfinitePay retornou HTTP ${response.status}.`;
    throw new InfinitePayApiError(String(message), response.status);
  }

  if (!payload || typeof payload !== 'object') {
    throw new InfinitePayApiError('Resposta inválida da InfinitePay.');
  }

  return payload as T;
}

export async function createInfinitePayCheckoutLink(
  input: CreateInfinitePayLinkInput,
): Promise<InfinitePayLinkResponse> {
  const body: Record<string, unknown> = {
    handle: getInfinitePayHandle(),
    order_nsu: input.orderNsu,
    redirect_url: input.redirectUrl,
    webhook_url: input.webhookUrl,
    items: input.items,
  };

  if (input.customer) {
    body.customer = input.customer;
  }

  if (input.address) {
    body.address = input.address;
  }

  const data = await postJson<{ url?: string }>('/links', body);

  if (!data.url || typeof data.url !== 'string') {
    throw new InfinitePayApiError(
      'A InfinitePay não retornou um link de pagamento válido.',
    );
  }

  return { url: data.url };
}

export async function checkInfinitePayPayment(
  input: InfinitePayPaymentCheckInput,
): Promise<InfinitePayPaymentCheckResponse> {
  const data = await postJson<InfinitePayPaymentCheckResponse>(
    '/payment_check',
    {
      handle: getInfinitePayHandle(),
      order_nsu: input.orderNsu,
      transaction_nsu: input.transactionNsu,
      slug: input.slug,
    },
  );

  return data;
}
