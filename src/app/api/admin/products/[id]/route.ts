import { NextResponse } from 'next/server';

import {
  deleteProduct,
  getAdminProductById,
  updateProduct,
} from '@infrastructure/database/repositories/product.repository';
import { parseAdminProductForm } from '@presentation/stores/admin/product/product.schemas';
import { formValuesToProductInput } from '@presentation/stores/admin/product/product.utils';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await getAdminProductById(id);

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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = parseAdminProductForm(body);
    const product = await updateProduct(id, formValuesToProductInput(parsed));
    return NextResponse.json(toApiResponse(product));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
