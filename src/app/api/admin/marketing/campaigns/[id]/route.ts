import { NextResponse } from 'next/server';

import {
  deleteCampaign,
  getCampaignById,
  syncCampaignCoupons,
  toggleCampaignStatus,
  updateCampaign,
} from '@infrastructure/database/repositories/campaign.repository';
import { campaignFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Campanha não encontrada.')),
        { status: 404 },
      );
    }
    return NextResponse.json(toApiResponse(campaign));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body?.action === 'toggle-status') {
      const campaign = await toggleCampaignStatus(id);
      return NextResponse.json(toApiResponse(campaign));
    }

    const parsed = campaignFormSchema.parse(body);
    const { couponIds, ...campaignInput } = parsed;
    await updateCampaign(id, campaignInput);
    await syncCampaignCoupons(id, couponIds);
    const refreshed = await getCampaignById(id);
    return NextResponse.json(toApiResponse(refreshed));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteCampaign(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
