import { NextResponse } from 'next/server';

import { getStoreSettings } from '@infrastructure/database/repositories/store-settings.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(toApiResponse(settings));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
