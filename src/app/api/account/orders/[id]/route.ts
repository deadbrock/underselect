import { NextResponse } from 'next/server';

import { UnauthorizedError } from '@application/errors';
import { requireCustomerSession } from '@application/services';
import { getCustomerOrderById } from '@infrastructure/database/repositories/order.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await requireCustomerSession(request);
    const { id } = await context.params;
    const order = await getCustomerOrderById(user.id, id);

    if (!order) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Pedido não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(toApiResponse(order));
  } catch (error) {
    const status = error instanceof UnauthorizedError ? 401 : 500;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
