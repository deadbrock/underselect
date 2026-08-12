import { NextResponse } from 'next/server';

import { logoutCustomer } from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function POST() {
  try {
    await logoutCustomer();
    return NextResponse.json(toApiResponse({ success: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
