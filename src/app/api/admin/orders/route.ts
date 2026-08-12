import { NextResponse } from 'next/server';

import { listOrdersForAdmin } from '@infrastructure/database/repositories/order.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limit = Number(searchParams.get('limit') ?? 200);
    const offset = Number(searchParams.get('offset') ?? 0);

    const result = await listOrdersForAdmin({
      search,
      status,
      limit: Number.isFinite(limit) ? limit : 200,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return NextResponse.json(toApiResponse(result));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
