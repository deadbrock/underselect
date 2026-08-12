import { NextResponse } from 'next/server';

import { getOrderForAdminById } from '@infrastructure/database/repositories/order.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const order = await getOrderForAdminById(id);

    if (!order) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Pedido não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(toApiResponse(order));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
