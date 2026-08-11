import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createCategory,
  listCategories,
} from '@infrastructure/database/repositories/category.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const createCategorySchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  label: z.string().trim().min(2),
  description: z.string().trim().optional(),
});

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json(toApiResponse(categories));
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createCategorySchema.parse(body);
    const category = await createCategory(parsed);
    return NextResponse.json(toApiResponse(category), { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 400 });
  }
}
