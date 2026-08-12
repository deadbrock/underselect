import { NextResponse } from 'next/server';

import { UnauthorizedError } from '@application/errors';
import { requireCustomerSession } from '@application/services';
import { listOrdersForCustomer } from '@infrastructure/database/repositories/order.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const user = await requireCustomerSession(request);
    const orders = await listOrdersForCustomer(user.id);
    return NextResponse.json(toApiResponse(orders));
  } catch (error) {
    const status = error instanceof UnauthorizedError ? 401 : 500;
    return NextResponse.json(toApiErrorResponse(error), { status });
  }
}
