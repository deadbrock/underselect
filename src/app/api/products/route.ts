import { NextResponse } from 'next/server';

import { listPublicProducts } from '@infrastructure/database/repositories/product.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await listPublicProducts();
    return NextResponse.json(toApiResponse(products));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
