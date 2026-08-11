import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createCollection,
  listCollections,
} from '@infrastructure/database/repositories/collection.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const createCollectionSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
});

export async function GET() {
  try {
    const collections = await listCollections();
    return NextResponse.json(toApiResponse(collections));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createCollectionSchema.parse(body);
    const collection = await createCollection(parsed);
    return NextResponse.json(toApiResponse(collection), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
