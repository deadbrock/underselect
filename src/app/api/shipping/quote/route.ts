import { NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateShipping } from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const quoteSchema = z.object({
  destinationCep: z.string().trim().min(8),
  subtotal: z.coerce.number().min(0),
  couponCode: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.parse(body);

    const result = await calculateShipping({
      destinationCep: parsed.destinationCep,
      subtotal: parsed.subtotal,
      couponCode: parsed.couponCode,
    });

    return NextResponse.json(toApiResponse(result.quote));
  } catch (error) {
    const status =
      error instanceof Error &&
      (error.message.includes('não configurado') ||
        error.message.includes('inválido') ||
        error.message.includes('não encontrado') ||
        error.message.includes('faixa'))
        ? 400
        : 500;

    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
