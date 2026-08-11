import { prisma } from '@infrastructure/database';
import { slugify } from '@shared/utils/slugify';

export async function listSelections() {
  return prisma.selection.findMany({
    orderBy: { name: 'asc' },
  });
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
