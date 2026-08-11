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

export async function listTeams() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
  });

  return attachProductCounts(teams, 'team');
}

export async function createTeam(input: { name: string }) {
  return prisma.team.create({
    data: {
      name: input.name,
      slug: slugify(input.name),
      status: 'active',
    },
  });
}

export async function updateTeam(
  id: string,
  input: {
    name?: string;
    status?: string;
  },
) {
  const existing = await prisma.team.findUniqueOrThrow({ where: { id } });

  if (input.name && input.name !== existing.name) {
    await prisma.product.updateMany({
      where: { team: existing.name },
      data: { team: input.name },
    });
  }

  return prisma.team.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.name ? slugify(input.name) : undefined,
      status: input.status,
    },
  });
}

export async function deleteTeam(id: string) {
  const team = await prisma.team.findUniqueOrThrow({ where: { id } });
  const count = await prisma.product.count({ where: { team: team.name } });

  if (count > 0) {
    throw new Error('Não é possível excluir time com produtos vinculados.');
  }

  await prisma.team.delete({ where: { id } });
}
