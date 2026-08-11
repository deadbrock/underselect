import { NextResponse } from 'next/server';

import { lookupCep } from '@application/services';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteParams {
  params: Promise<{ cep: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { cep } = await params;
    const result = await lookupCep(cep);

    if (!result) {
      return NextResponse.json(
        toApiErrorResponse(new Error('CEP não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(
      toApiResponse({
        street: result.street,
        neighborhood: result.neighborhood,
        city: result.city,
        state: result.state,
        complement: result.complement,
      }),
    );
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
