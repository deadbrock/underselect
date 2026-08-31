import { NextResponse } from 'next/server';

import { saveProductUpload } from '@infrastructure/storage/product-upload.storage';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

const MAX_BYTES = 8 * 1024 * 1024;

function sniffImageMime(buffer: Buffer, declaredType: string): string | null {
  const type = declaredType.toLowerCase().trim();

  if (type === 'image/jpg' || type === 'image/pjpeg' || type === 'image/jpeg') {
    return 'image/jpeg';
  }
  if (type === 'image/x-png' || type === 'image/png') return 'image/png';
  if (type === 'image/webp') return 'image/webp';
  if (type === 'image/gif') return 'image/gif';
  if (type === 'image/avif') return 'image/avif';
  if (type.startsWith('image/')) return 'image/jpeg';

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  if (buffer.length >= 3 && buffer.toString('ascii', 0, 3) === 'GIF') {
    return 'image/gif';
  }

  return null;
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
}

export const runtime = 'nodejs';

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

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        toApiErrorResponse(new Error('Imagem muito grande. Máximo de 8 MB.')),
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = sniffImageMime(buffer, file.type);

    if (!mimeType) {
      return NextResponse.json(
        toApiErrorResponse(
          new Error('Formato inválido. Envie um arquivo de imagem.'),
        ),
        { status: 400 },
      );
    }

    const extension = extensionForMime(mimeType);
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

    await saveProductUpload(buffer, filename);

    return NextResponse.json(
      toApiResponse({ url: `/api/media/products/${filename}` }),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
