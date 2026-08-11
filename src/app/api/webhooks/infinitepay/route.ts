import { z } from 'zod';

import {
  confirmOrderPaymentFromWebhook,
  PaymentConfirmationError,
  type InfinitePayWebhookPayload,
} from '@application/services';

const webhookSchema = z.object({
  invoice_slug: z.string().min(1),
  amount: z.coerce.number().int().min(0),
  paid_amount: z.coerce.number().int().min(0),
  installments: z.coerce.number().int().min(1).optional(),
  capture_method: z.string().min(1),
  transaction_nsu: z.string().min(1),
  order_nsu: z.string().min(1),
  receipt_url: z.string().url().optional(),
  items: z
    .array(
      z.object({
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().int().min(0),
        description: z.string(),
      }),
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = webhookSchema.parse(body) as InfinitePayWebhookPayload;

    await confirmOrderPaymentFromWebhook(parsed);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof PaymentConfirmationError) {
      console.error('[infinitepay:webhook]', error.message);
      return new Response(null, { status: 400 });
    }

    console.error('[infinitepay:webhook]', error);
    return new Response(null, { status: 400 });
  }
}

export async function GET() {
  return new Response('InfinitePay webhook endpoint', { status: 200 });
}
