import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createCategory,
  listCategories,
} from '@infrastructure/database/repositories/category.repository';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';
import { slugify } from '@shared/utils/slugify';

const createCategorySchema = z
  .object({
    label: z.string().trim().min(2),
    description: z.string().trim().optional(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/, 'Slug inválido')
      .optional(),
  })
  .transform((data) => ({
    ...data,
    slug: data.slug?.trim() || slugify(data.label),
  }))
  .refine((data) => data.slug.length > 0, {
    message: 'Não foi possível gerar slug a partir do nome da categoria',
    path: ['label'],
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
