import { NextResponse } from 'next/server';

import { listPublicProducts } from '@infrastructure/database/repositories/product.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export const revalidate = 60;

export async function GET() {
  try {
    const products = await listPublicProducts();
    return NextResponse.json(toApiResponse(products));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
