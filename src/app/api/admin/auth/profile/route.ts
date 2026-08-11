import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AdminAuthError,
  requireAdminSession,
  updateAdminProfile,
} from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  email: z.string().trim().email('Informe um e-mail válido'),
  phone: z.string().trim().optional().or(z.literal('')),
});

export async function PATCH(request: Request) {
  try {
    const sessionUser = await requireAdminSession(request);
    const body = profileSchema.parse(await request.json());

    const user = await updateAdminProfile({
      userId: sessionUser.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
    });

    return NextResponse.json(toApiResponse({ user }));
  } catch (error) {
    const status = error instanceof AdminAuthError ? 400 : 401;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}

export async function GET(request: Request) {
  try {
    const user = await requireAdminSession(request);
    return NextResponse.json(toApiResponse({ user }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 401 });
  }
}
