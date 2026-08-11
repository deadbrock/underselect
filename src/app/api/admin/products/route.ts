import { NextResponse } from 'next/server';

import {
  createProduct,
  listAdminProducts,
} from '@infrastructure/database/repositories/product.repository';
import { parseAdminProductForm } from '@presentation/stores/admin/product/product.schemas';
import { formValuesToProductInput } from '@presentation/stores/admin/product/product.utils';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

export async function GET() {
  try {
    const products = await listAdminProducts();
    return NextResponse.json(toApiResponse(products));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseAdminProductForm(body);
    const product = await createProduct(formValuesToProductInput(parsed));
    return NextResponse.json(toApiResponse(product), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
