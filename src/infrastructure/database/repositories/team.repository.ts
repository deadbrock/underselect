import { prisma } from '@infrastructure/database';
import { slugify } from '@shared/utils/slugify';

export async function listTeams() {
  return prisma.team.findMany({
    orderBy: { name: 'asc' },
  });
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
