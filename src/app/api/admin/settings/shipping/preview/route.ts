import { NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateShipping } from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const previewSchema = z.object({
  destinationCep: z.string().trim().min(8),
  subtotal: z.coerce.number().min(0),
  couponCode: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = previewSchema.parse(body);
    const result = await calculateShipping(parsed);
    return NextResponse.json(toApiResponse(result));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
