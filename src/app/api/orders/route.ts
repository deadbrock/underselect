import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  CouponValidationError,
  InfinitePayApiError,
} from '@application/services';
import {
  createOrderFromCheckout,
  OrderCheckoutValidationError,
} from '@infrastructure/database/repositories/order.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    cpf: z.string().trim().min(11),
    phone: z.string().trim().min(10),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variationId: z.string().optional(),
        slug: z.string().min(1),
        sku: z.string().min(1),
        name: z.string().min(1),
        imageUrl: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
        unitPrice: z.coerce.number().min(0),
        size: z.string().optional(),
        colorLabel: z.string().optional(),
        modelLabel: z.string().optional(),
        categoryId: z.string().optional(),
        categorySlug: z.string().optional(),
      }),
    )
    .min(1),
  shippingMethod: z.string().optional(),
  shippingAddress: z.record(z.unknown()),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.parse(body);

    const result = await createOrderFromCheckout({
      ...parsed,
      couponCode: parsed.couponCode?.toUpperCase(),
    });

    return NextResponse.json(toApiResponse(result), { status: 201 });
  } catch (error) {
    if (
      error instanceof CouponValidationError ||
      error instanceof OrderCheckoutValidationError ||
      error instanceof InfinitePayApiError
    ) {
      return NextResponse.json(toApiErrorResponse(error), { status: 400 });
    }
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
