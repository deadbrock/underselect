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

export async function createCheckoutOrderApi(input: Record<string, unknown>) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{
    orderId: string;
    orderNumber: string;
    total: number;
    couponDiscount: number;
    checkoutUrl: string;
    createdAt: string;
  }>(response);
}

export async function checkInfinitePayPaymentApi(input: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}) {
  const response = await fetch('/api/payments/infinitepay/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{
    paid: boolean;
    amountMatches: boolean;
    paymentStatus: string;
    orderStatus: string;
    order: {
      orderNumber: string;
      status: string;
      paymentStatus: string;
      total: number;
      captureMethod: string | null;
      receiptUrl: string | null;
      transactionNsu: string | null;
      invoiceSlug: string | null;
    } | null;
  }>(response);
}

export async function fetchOrderPaymentStatusApi(orderNumber: string) {
  const response = await fetch(
    `/api/payments/infinitepay/check?order=${encodeURIComponent(orderNumber)}`,
    { cache: 'no-store' },
  );

  return parseApiResponse<{
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    captureMethod: string | null;
    receiptUrl: string | null;
    transactionNsu: string | null;
    invoiceSlug: string | null;
  }>(response);
}
