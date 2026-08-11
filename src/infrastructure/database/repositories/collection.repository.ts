import { prisma } from '@infrastructure/database';

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function listCollections() {
  return prisma.collection.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  });
}

export async function createCollection(input: {
  name: string;
  description?: string;
}) {
  const slug = slugify(input.name);
  return prisma.collection.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
      status: 'active',
    },
  });
}

export async function updateCollection(
  id: string,
  input: {
    name?: string;
    description?: string;
    status?: string;
  },
) {
  const data: {
    name?: string;
    slug?: string;
    description?: string | null;
    status?: string;
  } = {
    description: input.description ?? undefined,
    status: input.status,
  };

  if (input.name) {
    data.name = input.name;
    data.slug = slugify(input.name);
  }

  return prisma.collection.update({
    where: { id },
    data,
  });
}

export async function deleteCollection(id: string) {
  const count = await prisma.product.count({ where: { collectionId: id } });
  if (count > 0) {
    throw new Error('Não é possível excluir coleção com produtos vinculados.');
  }
  await prisma.collection.delete({ where: { id } });
}

export async function listCollectionNames() {
  const collections = await prisma.collection.findMany({
    where: { status: 'active' },
    select: { name: true },
    orderBy: { name: 'asc' },
  });
  return collections.map((collection) => collection.name);
}
