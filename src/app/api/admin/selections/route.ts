import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createSelection,
  listSelections,
} from '@infrastructure/database/repositories/selection.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const createSelectionSchema = z.object({
  name: z.string().trim().min(2),
});

export async function GET() {
  try {
    const selections = await listSelections();
    return NextResponse.json(toApiResponse(selections));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSelectionSchema.parse(body);
    const selection = await createSelection(parsed);
    return NextResponse.json(toApiResponse(selection), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
