import { prisma } from '@infrastructure/database';
import { slugify } from '@shared/utils/slugify';

async function attachProductCounts<T extends { name: string }>(
  items: T[],
  field: 'team' | 'selection',
) {
  const counts = await prisma.product.groupBy({
    by: [field],
    where: { [field]: { not: null } },
    _count: { _all: true },
  });

  const countMap = new Map(
    counts.map((entry) => [entry[field] as string, entry._count._all]),
  );

  return items.map((item) => ({
    ...item,
    _count: { products: countMap.get(item.name) ?? 0 },
  }));
}

export async function listSelections() {
  const selections = await prisma.selection.findMany({
    orderBy: { name: 'asc' },
  });

  return attachProductCounts(selections, 'selection');
}

export async function createSelection(input: { name: string }) {
  return prisma.selection.create({
    data: {
      name: input.name,
      slug: slugify(input.name),
      status: 'active',
    },
  });
}

export async function updateSelection(
  id: string,
  input: {
    name?: string;
    status?: string;
  },
) {
  const existing = await prisma.selection.findUniqueOrThrow({ where: { id } });

  if (input.name && input.name !== existing.name) {
    await prisma.product.updateMany({
      where: { selection: existing.name },
      data: { selection: input.name },
    });
  }

  return prisma.selection.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.name ? slugify(input.name) : undefined,
      status: input.status,
    },
  });
}

export async function deleteSelection(id: string) {
  const selection = await prisma.selection.findUniqueOrThrow({ where: { id } });
  const count = await prisma.product.count({
    where: { selection: selection.name },
  });

  if (count > 0) {
    throw new Error('Não é possível excluir seleção com produtos vinculados.');
  }

  await prisma.selection.delete({ where: { id } });
}
