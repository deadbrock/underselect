import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteSelection,
  updateSelection,
} from '@infrastructure/database/repositories/selection.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateSelectionSchema = z.object({
  name: z.string().trim().min(2).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateSelectionSchema.parse(body);
    const selection = await updateSelection(id, parsed);
    return NextResponse.json(toApiResponse(selection));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteSelection(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
