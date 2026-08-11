import { NextResponse } from 'next/server';
import { z } from 'zod';

import { patchProductStock } from '@infrastructure/database/repositories/product.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const patchStockSchema = z
  .object({
    variationId: z.string().trim().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => data.stock !== undefined || data.minStock !== undefined, {
    message: 'Informe estoque ou quantidade mínima.',
  });

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = patchStockSchema.parse(body);
    const product = await patchProductStock(id, parsed);

    if (!product) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Produto não encontrado.')),
        { status: 404 },
      );
    }

    return NextResponse.json(toApiResponse(product));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
