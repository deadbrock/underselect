import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  getOrderPaymentStatus,
  reconcileOrderPayment,
  PaymentConfirmationError,
} from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const paymentCheckSchema = z.object({
  orderNsu: z.string().min(1),
  transactionNsu: z.string().min(1),
  slug: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentCheckSchema.parse(body);

    const result = await reconcileOrderPayment(parsed);
    const status = await getOrderPaymentStatus(parsed.orderNsu);

    return NextResponse.json(
      toApiResponse({
        ...result,
        order: status,
      }),
    );
  } catch (error) {
    const status = error instanceof PaymentConfirmationError ? 400 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}

export async function GET(request: Request) {
  try {
    const orderNumber = new URL(request.url).searchParams.get('order');
    if (!orderNumber) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Informe o número do pedido.')),
        { status: 400 },
      );
    }

    const status = await getOrderPaymentStatus(orderNumber);
    if (!status) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Pedido não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(toApiResponse(status));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
