import { NextResponse } from 'next/server';

import { listCoupons } from '@infrastructure/database/repositories/coupon.repository';
import { listAttributions } from '@infrastructure/database/repositories/order.repository';
import { listCampaigns } from '@infrastructure/database/repositories/campaign.repository';
import { listInfluencers } from '@infrastructure/database/repositories/influencer.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const [coupons, attributions, campaigns, influencers] = await Promise.all([
      listCoupons({
        search: searchParams.get('search') ?? undefined,
        status: searchParams.get('status') ?? undefined,
        influencerId: searchParams.get('influencerId') ?? undefined,
        campaignId: searchParams.get('campaignId') ?? undefined,
      }),
      listAttributions({
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(`${dateTo}T23:59:59.999Z`) : undefined,
        couponId: searchParams.get('couponId') ?? undefined,
        limit: 500,
      }),
      listCampaigns(),
      listInfluencers(),
    ]);

    const influencerMap = new Map(influencers.map((i) => [i.id, i.name]));
    const campaignMap = new Map(campaigns.map((c) => [c.id, c.name]));

    const attrByCoupon = new Map<string, typeof attributions>();
    for (const attr of attributions) {
      const list = attrByCoupon.get(attr.couponId) ?? [];
      list.push(attr);
      attrByCoupon.set(attr.couponId, list);
    }

    const rows = coupons.map((coupon) => {
      const attrs = attrByCoupon.get(coupon.id) ?? [];
      const revenue = attrs.reduce((s, a) => s + a.attributedRevenue, 0);
      const discount = attrs.reduce((s, a) => s + a.discountAmount, 0);

      return {
        id: coupon.id,
        code: coupon.code,
        type: coupon.discountType,
        campaign: coupon.campaignId
          ? (campaignMap.get(coupon.campaignId) ?? '—')
          : '—',
        influencer: coupon.influencerId
          ? (influencerMap.get(coupon.influencerId) ?? '—')
          : '—',
        usages: coupon.usageCount,
        usageLimit: coupon.usageLimit ?? null,
        orders: attrs.length,
        revenue,
        discount,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
      };
    });

    return NextResponse.json(toApiResponse(rows));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
