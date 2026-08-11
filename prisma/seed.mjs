import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    slug: 'clubes-brasileiros',
    label: 'Clubes Brasileiros',
    description:
      'Camisas oficiais e licenciadas dos principais clubes do Brasil.',
  },
  {
    slug: 'selecoes',
    label: 'Seleções',
    description: 'Uniformes de seleções nacionais e edições especiais.',
  },
  {
    slug: 'retro',
    label: 'Retrô',
    description: 'Camisas clássicas que marcaram gerações.',
  },
  {
    slug: 'casual-esportiva',
    label: 'Casual Esportiva',
    description: 'Peças lifestyle com identidade esportiva.',
  },
  {
    slug: 'cuecas-boxer',
    label: 'Cuecas & Boxer',
    description: 'Conforto premium para o dia a dia.',
  },
  {
    slug: 'intimas-masculinas',
    label: 'Íntimas Masculinas',
    description: 'Linha íntima com tecidos de alta performance.',
  },
];

const COLLECTIONS = [
  'Verão 2026',
  'Brasileirão 2026',
  'Seleções Copa',
  'Premium Match',
  'Retrô Classics',
  'Core Intimates',
];

const TEAMS = [
  'Flamengo',
  'Corinthians',
  'Palmeiras',
  'São Paulo',
  'Grêmio',
  'Internacional',
  'Fluminense',
  'Botafogo',
  'Santos',
  'Atlético-MG',
  'Cruzeiro',
  'Vasco',
];

const SELECTIONS = [
  'Brasil',
  'Argentina',
  'Portugal',
  'França',
  'Alemanha',
  'Itália',
  'Espanha',
  'Inglaterra',
];

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedTaxonomies() {
  for (const [index, category] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        label: category.label,
        description: category.description,
        sortOrder: index,
        status: 'active',
      },
      create: {
        slug: category.slug,
        label: category.label,
        description: category.description,
        sortOrder: index,
        status: 'active',
      },
    });
  }

  for (const name of COLLECTIONS) {
    const slug = slugify(name);
    await prisma.collection.upsert({
      where: { slug },
      update: { name, status: 'active' },
      create: { name, slug, status: 'active' },
    });
  }

  for (const name of TEAMS) {
    const slug = slugify(name);
    await prisma.team.upsert({
      where: { slug },
      update: { name, status: 'active' },
      create: { name, slug, status: 'active' },
    });
  }

  for (const name of SELECTIONS) {
    const slug = slugify(name);
    await prisma.selection.upsert({
      where: { slug },
      update: { name, status: 'active' },
      create: { name, slug, status: 'active' },
    });
  }
}

async function seedAdminUser() {
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@underselect.com')
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_SEED_PASSWORD || 'Admin@123456';
  const name = process.env.ADMIN_SEED_NAME || 'Administrador';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin já existe: ${email}`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'admin',
    },
  });

  console.log(`Admin criado: ${email}`);
}

async function main() {
  await seedTaxonomies();
  await seedAdminUser();
  console.log('Seed concluído: categorias, coleções, times, seleções e admin.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
