import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  AdminAuthError,
  changeAdminPassword,
  requireAdminSession,
} from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Informe a senha atual'),
    newPassword: z
      .string()
      .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Za-z]/, 'A nova senha deve conter letras')
      .regex(/\d/, 'A nova senha deve conter números'),
    confirmPassword: z.string().min(8, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export async function POST(request: Request) {
  try {
    const user = await requireAdminSession(request);
    const body = changePasswordSchema.parse(await request.json());

    await changeAdminPassword({
      userId: user.id,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return NextResponse.json(
      toApiResponse({
        success: true,
        requiresLogin: true,
      }),
    );
  } catch (error) {
    const status = error instanceof AdminAuthError ? 400 : 401;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
