import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AdminAuthError,
  getAdminSessionCookieOptions,
  loginAdmin,
} from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'Informe a senha'),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      undefined;
    const userAgent = request.headers.get('user-agent') ?? undefined;

    const { user, token } = await loginAdmin({
      email: body.email,
      password: body.password,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(toApiResponse({ user }));
    response.cookies.set(getAdminSessionCookieOptions(token));
    return response;
  } catch (error) {
    const status = error instanceof AdminAuthError ? 401 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
