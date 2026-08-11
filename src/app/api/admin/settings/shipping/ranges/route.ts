import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createShippingDistanceRange,
  ShippingRangeValidationError,
} from '@infrastructure/database/repositories/shipping-config.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const rangeSchema = z.object({
  startKm: z.coerce.number().min(0),
  endKm: z.coerce.number().min(0),
  pricePerKm: z.coerce.number().min(0),
  additionalFee: z.coerce.number().min(0).optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rangeSchema.parse(body);
    const range = await createShippingDistanceRange(parsed);
    return NextResponse.json(toApiResponse(range), { status: 201 });
  } catch (error) {
    const status = error instanceof ShippingRangeValidationError ? 400 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
