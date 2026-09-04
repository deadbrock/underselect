import { PrismaClient } from '@prisma/client';

import { prisma } from '@infrastructure/database';

const globalForUploadPrisma = globalThis as unknown as {
  productUploadPrisma?: PrismaClient;
};

function uploadDatabaseUrl() {
  return process.env.DIRECT_URL || process.env.DATABASE_URL;
}

function getUploadPrisma() {
  const url = uploadDatabaseUrl();
  const pooled = process.env.DATABASE_URL;

  if (!url || url === pooled) {
    return prisma;
  }

  if (!globalForUploadPrisma.productUploadPrisma) {
    const separator = url.includes('?') ? '&' : '?';
    globalForUploadPrisma.productUploadPrisma = new PrismaClient({
      datasources: {
        db: { url: `${url}${separator}connection_limit=3` },
      },
      log: ['error'],
    });
  }

  return globalForUploadPrisma.productUploadPrisma;
}

let tableReady: Promise<void> | null = null;

async function ensureProductUploadTable() {
  const db = getUploadPrisma();

  if (!tableReady) {
    tableReady = (async () => {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "ProductUpload" (
          "filename" TEXT NOT NULL,
          "mimeType" TEXT NOT NULL,
          "data" BYTEA NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ProductUpload_pkey" PRIMARY KEY ("filename")
        )
      `;
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }

  try {
    await tableReady;
  } catch {
    // Sem permissão de CREATE a tabela pode já existir via migrate.
  }
}

export async function saveProductUploadRecord(
  filename: string,
  mimeType: string,
  data: Buffer,
) {
  const db = getUploadPrisma();

  await ensureProductUploadTable();
  await db.$executeRaw`
    INSERT INTO "ProductUpload" ("filename", "mimeType", "data", "createdAt")
    VALUES (${filename}, ${mimeType}, ${data}, CURRENT_TIMESTAMP)
    ON CONFLICT ("filename") DO UPDATE SET
      "mimeType" = EXCLUDED."mimeType",
      "data" = EXCLUDED."data"
  `;
}

export async function readProductUploadRecord(filename: string) {
  const db = getUploadPrisma();

  await ensureProductUploadTable();
  const rows = await db.$queryRaw<
    Array<{ data: Uint8Array; mimeType: string }>
  >`
    SELECT "data", "mimeType"
    FROM "ProductUpload"
    WHERE "filename" = ${filename}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    data: Buffer.from(row.data),
    mimeType: row.mimeType,
  };
}
