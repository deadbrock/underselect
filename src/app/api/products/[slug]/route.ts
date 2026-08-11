import { NextResponse } from 'next/server';

import { getProductDetailBySlug } from '@infrastructure/database/repositories/product.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export const revalidate = 60;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const product = await getProductDetailBySlug(slug);

    if (!product) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Produto não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(toApiResponse(product));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
