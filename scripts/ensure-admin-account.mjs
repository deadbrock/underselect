import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variável ${name} é obrigatória.`);
  return value;
}

const email = readRequired('ADMIN_SEED_EMAIL').toLowerCase();
const password = readRequired('ADMIN_SEED_PASSWORD');
const name = process.env.ADMIN_SEED_NAME?.trim() || 'Felipe Guimarães';
const passwordHash = await bcrypt.hash(password, 12);

const existing = await prisma.adminUser.findUnique({ where: { email } });

if (existing) {
  await prisma.adminUser.update({
    where: { id: existing.id },
    data: { name, passwordHash, isActive: true },
  });
  console.log(`Admin atualizado: ${email}`);
} else {
  await prisma.adminUser.create({
    data: { email, name, passwordHash, role: 'admin', isActive: true },
  });
  console.log(`Admin criado: ${email}`);
}

await prisma.$disconnect();
