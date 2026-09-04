import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import {
  readProductUploadRecord,
  saveProductUploadRecord,
} from '@infrastructure/database/repositories/product-upload.repository';

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

export function getProductUploadDir(): string {
  const base = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads');
  return path.join(base, 'products');
}

export function getLegacyPublicUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads', 'products');
}

function candidateUploadDirs(): string[] {
  const dirs = [getProductUploadDir(), getLegacyPublicUploadDir()];
  if (process.platform !== 'win32') {
    dirs.push(path.join('/tmp', 'uploads', 'products'));
  }
  return [...new Set(dirs)];
}

export function isSafeUploadFilename(filename: string): boolean {
  return SAFE_FILENAME.test(filename);
}

async function writeDiskCache(buffer: Buffer, filename: string) {
  await Promise.all(
    candidateUploadDirs().map(async (dir) => {
      try {
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), buffer);
      } catch {
        // Disco é só cache. Railway/Vercel apagam o filesystem no deploy.
      }
    }),
  );
}

async function readDiskCache(filename: string): Promise<Buffer | null> {
  const locations = candidateUploadDirs().map((dir) =>
    path.join(dir, filename),
  );

  for (const filePath of locations) {
    try {
      return await readFile(filePath);
    } catch {
      continue;
    }
  }

  return null;
}

let diskBackfill: Promise<void> | null = null;

async function backfillDiskUploadsToDatabase() {
  if (!diskBackfill) {
    diskBackfill = (async () => {
      for (const dir of candidateUploadDirs()) {
        try {
          const files = await readdir(dir);
          for (const filename of files) {
            if (!isSafeUploadFilename(filename)) continue;
            try {
              const buffer = await readFile(path.join(dir, filename));
              await saveProductUploadRecord(
                filename,
                contentTypeForFilename(filename),
                buffer,
              );
            } catch {
              continue;
            }
          }
        } catch {
          continue;
        }
      }
    })().catch(() => undefined);
  }

  await diskBackfill;
}

export async function saveProductUpload(
  buffer: Buffer,
  filename: string,
): Promise<void> {
  if (!isSafeUploadFilename(filename)) {
    throw new Error('Nome de arquivo inválido.');
  }

  await saveProductUploadRecord(
    filename,
    contentTypeForFilename(filename),
    buffer,
  );
  await writeDiskCache(buffer, filename);
  void backfillDiskUploadsToDatabase();
}

export async function readProductUpload(
  filename: string,
): Promise<Buffer | null> {
  if (!isSafeUploadFilename(filename)) return null;

  void backfillDiskUploadsToDatabase();

  const cached = await readDiskCache(filename);
  if (cached) {
    void saveProductUploadRecord(
      filename,
      contentTypeForFilename(filename),
      cached,
    ).catch(() => undefined);
    return cached;
  }

  const stored = await readProductUploadRecord(filename);
  if (!stored) return null;

  void writeDiskCache(stored.data, filename);
  return stored.data;
}

export function contentTypeForFilename(filename: string): string {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return 'image/jpeg';
  }
}
