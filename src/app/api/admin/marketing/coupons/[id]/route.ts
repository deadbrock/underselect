import { NextResponse } from 'next/server';

import {
  deleteCoupon,
  ensureCouponCodeAvailable,
  getCouponById,
  toggleCouponStatus,
  updateCoupon,
} from '@infrastructure/database/repositories/coupon.repository';
import { couponFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const coupon = await getCouponById(id);
    if (!coupon) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Cupom não encontrado.')),
        { status: 404 },
      );
    }
    return NextResponse.json(toApiResponse(coupon));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body?.action === 'toggle-status') {
      const coupon = await toggleCouponStatus(id);
      return NextResponse.json(toApiResponse(coupon));
    }

    const parsed = couponFormSchema.parse(body);
    await ensureCouponCodeAvailable(parsed.code, id);
    const coupon = await updateCoupon(id, parsed);
    return NextResponse.json(toApiResponse(coupon));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteCoupon(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
