import { NextResponse } from 'next/server';

import { getCustomerSessionUser } from '@application/services';
import { UnauthorizedError } from '@application/errors';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET() {
  try {
    const user = await getCustomerSessionUser();
    if (!user) {
      throw new UnauthorizedError('Sessão não encontrada.');
    }

    return NextResponse.json(toApiResponse({ user }));
  } catch (error) {
    const status = error instanceof UnauthorizedError ? 401 : 400;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
