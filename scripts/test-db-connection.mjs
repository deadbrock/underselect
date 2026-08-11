import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const envPath = resolve(process.cwd(), '.env.local');
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
  if (!match) continue;
  const key = match[1].trim();
  const value = match[2].trim().replace(/^"|"$/g, '');
  if (!process.env[key]) process.env[key] = value;
}

const prisma = new PrismaClient();

try {
  const result = await prisma.$queryRaw`SELECT 1 AS ok, current_database() AS database, version() AS version`;
  console.log('Conexão OK');
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
} catch (error) {
  console.error('Conexão FALHOU');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
