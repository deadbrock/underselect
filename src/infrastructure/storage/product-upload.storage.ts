import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

export function getProductUploadDir(): string {
  const base = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads');
  return path.join(base, 'products');
}

export function getLegacyPublicUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads', 'products');
}

function candidateUploadDirs(): string[] {
  const dirs = [getProductUploadDir()];
  if (process.platform !== 'win32') {
    dirs.push(path.join('/tmp', 'uploads', 'products'));
  }
  return dirs;
}

export function isSafeUploadFilename(filename: string): boolean {
  return SAFE_FILENAME.test(filename);
}

export async function saveProductUpload(
  buffer: Buffer,
  filename: string,
): Promise<void> {
  let lastError: unknown;

  for (const dir of candidateUploadDirs()) {
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buffer);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Não foi possível gravar a imagem.');
}

export async function readProductUpload(
  filename: string,
): Promise<Buffer | null> {
  if (!isSafeUploadFilename(filename)) return null;

  const locations = [
    ...candidateUploadDirs().map((dir) => path.join(dir, filename)),
    path.join(getLegacyPublicUploadDir(), filename),
  ];

  for (const filePath of locations) {
    try {
      return await readFile(filePath);
    } catch {
      continue;
    }
  }

  return null;
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
