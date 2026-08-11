import { NextResponse } from 'next/server';

import {
  createCoupon,
  ensureCouponCodeAvailable,
  listCoupons,
} from '@infrastructure/database/repositories/coupon.repository';
import { couponFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coupons = await listCoupons({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      discountType: searchParams.get('discountType') ?? undefined,
      influencerId: searchParams.get('influencerId') ?? undefined,
      campaignId: searchParams.get('campaignId') ?? undefined,
    });
    return NextResponse.json(toApiResponse(coupons));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = couponFormSchema.parse(body);
    await ensureCouponCodeAvailable(parsed.code);
    const coupon = await createCoupon(parsed);
    return NextResponse.json(toApiResponse(coupon), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
