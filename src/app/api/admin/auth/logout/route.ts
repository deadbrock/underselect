import { NextResponse } from 'next/server';

import { logoutAdmin } from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function POST() {
  try {
    await logoutAdmin();
    return NextResponse.json(toApiResponse({ success: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
