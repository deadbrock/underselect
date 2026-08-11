import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteCategory,
  updateCategory,
} from '@infrastructure/database/repositories/category.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateCategorySchema = z.object({
  label: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateCategorySchema.parse(body);
    const category = await updateCategory(id, parsed);
    return NextResponse.json(toApiResponse(category));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteCategory(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
