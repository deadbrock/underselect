import { NextResponse } from 'next/server';

import { prisma } from '@infrastructure/database';
import { getLogger } from '@infrastructure/di';
import { toApiResponse, toApiErrorResponse } from '@shared/utils';

export async function GET() {
  const logger = getLogger();

  try {
    await prisma.$queryRaw`SELECT 1`;

    logger.debug('Health check passed');

    return NextResponse.json(
      toApiResponse({ status: 'ok', timestamp: new Date().toISOString() }),
    );
  } catch (error) {
    logger.error('Health check failed', { error });

    return NextResponse.json(toApiErrorResponse(error), { status: 503 });
  }
}
