import { NextResponse } from 'next/server';

import { listInfluencers } from '@infrastructure/database/repositories/influencer.repository';
import { listAttributions } from '@infrastructure/database/repositories/order.repository';
import { listCampaigns } from '@infrastructure/database/repositories/campaign.repository';
import { listCoupons } from '@infrastructure/database/repositories/coupon.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const [influencers, attributions, campaigns, coupons] = await Promise.all([
      listInfluencers({
        search: searchParams.get('search') ?? undefined,
        status: searchParams.get('status') ?? undefined,
      }),
      listAttributions({
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(`${dateTo}T23:59:59.999Z`) : undefined,
        influencerId: searchParams.get('influencerId') ?? undefined,
        limit: 1000,
      }),
      listCampaigns(),
      listCoupons(),
    ]);

    const rows = influencers.map((inf) => {
      const infAttrs = attributions.filter((a) => a.influencerId === inf.id);
      const infCampaigns = campaigns.filter((c) => c.influencerId === inf.id);
      const infCoupons = coupons.filter((c) => c.influencerId === inf.id);
      const revenue = infAttrs.reduce((s, a) => s + a.attributedRevenue, 0);
      const discount = infAttrs.reduce((s, a) => s + a.discountAmount, 0);
      const orders = infAttrs.length;
      const usages = infCoupons.reduce((s, c) => s + c.usageCount, 0);

      return {
        influencerId: inf.id,
        influencer: inf.name,
        identifierCode: inf.identifierCode,
        status: inf.status,
        campaigns: infCampaigns.length,
        coupons: infCoupons.length,
        usages,
        orders,
        revenue,
        discount,
        averageTicket: orders > 0 ? revenue / orders : 0,
        mainCampaign: infCampaigns[0]?.name ?? '—',
      };
    });

    return NextResponse.json(toApiResponse(rows));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
