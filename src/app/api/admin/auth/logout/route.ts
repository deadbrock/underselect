import { NextResponse } from 'next/server';

import {
  getAdminSessionClearCookieOptions,
  logoutAdmin,
} from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function POST() {
  try {
    await logoutAdmin();
    const response = NextResponse.json(toApiResponse({ success: true }));
    response.cookies.set(getAdminSessionClearCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
