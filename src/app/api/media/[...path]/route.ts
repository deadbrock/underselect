import { NextResponse } from 'next/server';

import {
  contentTypeForFilename,
  readProductUpload,
} from '@infrastructure/storage/product-upload.storage';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(_request: Request, context: RouteContext) {
  const { path: segments } = await context.params;
  const folder = segments[0];
  const filename = segments[1] ? decodeURIComponent(segments[1]) : '';

  if (folder !== 'products' || !filename) {
    return new NextResponse('Imagem não encontrada.', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const file = await readProductUpload(filename);

  if (!file) {
    return new NextResponse('Imagem não encontrada.', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      'Content-Type': contentTypeForFilename(filename),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
