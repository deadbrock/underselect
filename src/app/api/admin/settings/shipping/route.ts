import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { validateShippingConfigConsistency } from '@application/services';
import {
  getShippingConfig,
  ShippingRangeValidationError,
  updateShippingConfig,
} from '@infrastructure/database/repositories/shipping-config.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const shippingConfigSchema = z.object({
  shippingBaseFee: z.coerce.number().min(0),
  shippingPerKm: z.coerce.number().min(0),
  shippingMinFee: z.coerce.number().min(0),
  shippingMaxFee: z.coerce.number().min(0),
  freeShippingEnabled: z.boolean(),
  freeShippingMinValue: z.coerce.number().min(0),
  distanceCalculationEnabled: z.boolean(),
  distanceRangesEnabled: z.boolean(),
});

export async function GET() {
  try {
    const config = await getShippingConfig();
    return NextResponse.json(toApiResponse(config));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = shippingConfigSchema.parse(body);
    const current = await getShippingConfig();

    validateShippingConfigConsistency({
      ...parsed,
      ranges: current.ranges,
    });

    const config = await updateShippingConfig(parsed);
    revalidatePath('/', 'layout');

    return NextResponse.json(toApiResponse(config));
  } catch (error) {
    const status = error instanceof ShippingRangeValidationError ? 400 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
