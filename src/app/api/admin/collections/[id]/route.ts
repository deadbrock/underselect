import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteCollection,
  updateCollection,
} from '@infrastructure/database/repositories/collection.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateCollectionSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateCollectionSchema.parse(body);
    const collection = await updateCollection(id, parsed);
    return NextResponse.json(toApiResponse(collection));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteCollection(id);
    return NextResponse.json(toApiResponse({ deleted: true }));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
