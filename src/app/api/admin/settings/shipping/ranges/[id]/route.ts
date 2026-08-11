import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteShippingDistanceRange,
  ShippingRangeValidationError,
  updateShippingDistanceRange,
} from '@infrastructure/database/repositories/shipping-config.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const rangeSchema = z.object({
  startKm: z.coerce.number().min(0),
  endKm: z.coerce.number().min(0),
  pricePerKm: z.coerce.number().min(0),
  additionalFee: z.coerce.number().min(0).optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = rangeSchema.parse(body);
    const range = await updateShippingDistanceRange(id, parsed);
    return NextResponse.json(toApiResponse(range));
  } catch (error) {
    const status = error instanceof ShippingRangeValidationError ? 400 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteShippingDistanceRange(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
