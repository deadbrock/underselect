import { NextResponse } from 'next/server';

import { removeBackgroundOnServer } from '@infrastructure/image/remove-background.server';
import { toApiErrorResponse } from '@shared/utils';

export const runtime = 'nodejs';
export const maxDuration = 90;

const MAX_BYTES = 6 * 1024 * 1024;

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
        toApiErrorResponse(
          new Error('Imagem muito grande para remover o fundo.'),
        ),
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const png = await removeBackgroundOnServer(buffer);

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const raw =
      error instanceof Error
        ? error.message
        : 'Não foi possível remover o fundo.';
    const message = /sharp/i.test(raw)
      ? 'O servidor ainda não está com o processador de imagem pronto. Recrie o container da aplicação e tente de novo.'
      : raw;

    return NextResponse.json(toApiErrorResponse(new Error(message)), {
      status: 500,
    });
  }
}
