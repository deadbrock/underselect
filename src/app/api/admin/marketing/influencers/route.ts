import { NextResponse } from 'next/server';

import {
  createInfluencer,
  listInfluencers,
} from '@infrastructure/database/repositories/influencer.repository';
import { influencerFormSchema } from '@presentation/stores/admin/marketing/marketing.schemas';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const influencers = await listInfluencers({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });
    return NextResponse.json(toApiResponse(influencers));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = influencerFormSchema.parse(body);
    const influencer = await createInfluencer(parsed);
    return NextResponse.json(toApiResponse(influencer), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
