import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  buildAppliedCouponLabel,
  calculateCouponDiscountAmount,
  calculateSubtotal,
  CouponValidationError,
  countCustomerCouponRedemptions,
  validateCouponContext,
} from '@application/services';
import {
  countCouponRedemptionsByCustomer,
  getCouponByCode,
} from '@infrastructure/database/repositories/coupon.repository';
import {
  countCustomerOrders,
  getCustomerByCpf,
} from '@infrastructure/database/repositories/customer.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const validateSchema = z.object({
  code: z.string().trim().min(1),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variationId: z.string().optional(),
      categoryId: z.string().optional(),
      categorySlug: z.string().optional(),
      quantity: z.coerce.number().int().min(1),
      unitPrice: z.coerce.number().min(0),
    }),
  ),
  customerCpf: z.string().optional(),
  customerEmail: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateSchema.parse(body);
    const code = parsed.code.toUpperCase();

    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json(
        toApiResponse({
          valid: false,
          feedback: {
            type: 'invalid',
            message: 'Cupom inválido ou inexistente.',
          },
        }),
      );
    }

    const subtotal = calculateSubtotal(parsed.items);
    let customerOrderCount = 0;
    let customerId: string | undefined;

    if (parsed.customerCpf) {
      const customer = await getCustomerByCpf(parsed.customerCpf);
      if (customer) {
        customerId = customer.id;
        customerOrderCount = await countCustomerOrders(customer.id);
      }
    }

    try {
      validateCouponContext({
        coupon,
        items: parsed.items,
        subtotal,
        customerId,
        customerOrderCount,
      });

      if (customerId) {
        await countCustomerCouponRedemptions(
          coupon.id,
          customerId,
          countCouponRedemptionsByCustomer,
          coupon.usageLimitPerCustomer,
        );
      }
    } catch (error) {
      if (error instanceof CouponValidationError) {
        const type =
          error.code === 'EXPIRED' || error.code === 'NOT_STARTED'
            ? 'expired'
            : 'invalid';
        return NextResponse.json(
          toApiResponse({
            valid: false,
            feedback: { type, message: error.message },
          }),
        );
      }
      throw error;
    }

    const discountAmount = calculateCouponDiscountAmount(
      coupon,
      parsed.items,
      subtotal,
    );

    const cartType =
      coupon.discountType === 'free-shipping'
        ? 'free-shipping'
        : coupon.discountType === 'fixed'
          ? 'fixed'
          : coupon.discountType === 'category'
            ? 'category'
            : coupon.discountType === 'first-purchase'
              ? 'first-purchase'
              : 'percent';

    return NextResponse.json(
      toApiResponse({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: cartType,
          value: Number(coupon.discountValue),
          label: buildAppliedCouponLabel(coupon),
          category: undefined,
        },
        discountAmount,
        feedback: {
          type: 'success',
          message: `Cupom ${coupon.code} aplicado — ${buildAppliedCouponLabel(coupon)}.`,
        },
      }),
    );
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
