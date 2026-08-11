import { NextResponse } from 'next/server';

import {
  deleteInfluencer,
  getInfluencerById,
  toggleInfluencerStatus,
  updateInfluencer,
} from '@infrastructure/database/repositories/influencer.repository';
import { influencerFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const influencer = await getInfluencerById(id);
    if (!influencer) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Influenciador não encontrado.')),
        { status: 404 },
      );
    }
    return NextResponse.json(toApiResponse(influencer));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body?.action === 'toggle-status') {
      const influencer = await toggleInfluencerStatus(id);
      return NextResponse.json(toApiResponse(influencer));
    }

    const parsed = influencerFormSchema.parse(body);
    const influencer = await updateInfluencer(id, parsed);
    return NextResponse.json(toApiResponse(influencer));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteInfluencer(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
