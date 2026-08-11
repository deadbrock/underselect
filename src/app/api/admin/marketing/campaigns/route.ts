import { NextResponse } from 'next/server';

import {
  createCampaign,
  getCampaignById,
  listCampaigns,
  syncCampaignCoupons,
} from '@infrastructure/database/repositories/campaign.repository';
import { campaignFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaigns = await listCampaigns({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      influencerId: searchParams.get('influencerId') ?? undefined,
    });
    return NextResponse.json(toApiResponse(campaigns));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = campaignFormSchema.parse(body);
    const { couponIds, ...campaignInput } = parsed;
    const campaign = await createCampaign(campaignInput);
    await syncCampaignCoupons(campaign.id, couponIds);
    const refreshed = await getCampaignById(campaign.id);
    return NextResponse.json(toApiResponse(refreshed), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
