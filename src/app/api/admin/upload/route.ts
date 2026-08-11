import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Arquivo de imagem não informado.')),
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        toApiErrorResponse(
          new Error('Formato inválido. Use JPG, PNG ou WebP.'),
        ),
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Imagem muito grande. Máximo de 5 MB.')),
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = extensionForMime(file.type);
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json(
      toApiResponse({ url: `/uploads/products/${filename}` }),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
