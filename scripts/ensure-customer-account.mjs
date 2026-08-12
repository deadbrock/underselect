import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável ${name} é obrigatória.`);
  }
  return value;
}

async function main() {
  const email = readRequired('CUSTOMER_SEED_EMAIL').toLowerCase();
  const password = readRequired('CUSTOMER_SEED_PASSWORD');
  const firstName = process.env.CUSTOMER_SEED_FIRST_NAME?.trim() || 'Felipe';
  const lastName = process.env.CUSTOMER_SEED_LAST_NAME?.trim() || 'Guimarães';
  const cpf = (process.env.CUSTOMER_SEED_CPF || '39053344705').replace(/\D/g, '');
  const phone = (process.env.CUSTOMER_SEED_PHONE || '11999999999').replace(/\D/g, '');

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.customer.findUnique({ where: { email } });

  if (existing) {
    await prisma.customer.update({
      where: { id: existing.id },
      data: {
        firstName,
        lastName,
        phone,
        passwordHash,
        status: 'active',
      },
    });
    console.log(`Conta atualizada: ${email}`);
    return;
  }

  await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email,
      cpf,
      phone,
      passwordHash,
      status: 'active',
    },
  });

  console.log(`Conta criada: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
