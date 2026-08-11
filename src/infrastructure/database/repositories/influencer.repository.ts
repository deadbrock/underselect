import { prisma } from '@infrastructure/database';
import {
  mapInfluencerToCreate,
  mapInfluencerToDomain,
} from '@infrastructure/database/mappers/marketing.mapper';
import type { AdminInfluencerStatus } from '@shared/types/marketing-admin.types';

export async function listInfluencers(filters?: {
  search?: string;
  status?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { publicName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { identifierCode: { contains: q, mode: 'insensitive' } },
    ];
  }

  const records = await prisma.influencer.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
  });

  return records.map(mapInfluencerToDomain);
}

export async function getInfluencerById(id: string) {
  const record = await prisma.influencer.findUnique({ where: { id } });
  return record ? mapInfluencerToDomain(record) : null;
}

export async function createInfluencer(input: {
  name: string;
  username: string;
  email: string;
  phone: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  identifierCode: string;
  status: AdminInfluencerStatus;
  notes: string;
}) {
  const record = await prisma.influencer.create({
    data: mapInfluencerToCreate(input),
  });
  return mapInfluencerToDomain(record);
}

export async function updateInfluencer(
  id: string,
  input: Parameters<typeof mapInfluencerToCreate>[0],
) {
  const record = await prisma.influencer.update({
    where: { id },
    data: mapInfluencerToCreate(input),
  });
  return mapInfluencerToDomain(record);
}

export async function toggleInfluencerStatus(id: string) {
  const current = await prisma.influencer.findUniqueOrThrow({ where: { id } });
  const record = await prisma.influencer.update({
    where: { id },
    data: {
      status: current.status === 'active' ? 'inactive' : 'active',
    },
  });
  return mapInfluencerToDomain(record);
}

export async function deleteInfluencer(id: string) {
  const [campaigns, coupons, orders] = await Promise.all([
    prisma.campaign.count({ where: { influencerId: id } }),
    prisma.coupon.count({ where: { influencerId: id } }),
    prisma.order.count({ where: { influencerId: id } }),
  ]);

  if (campaigns > 0 || coupons > 0 || orders > 0) {
    throw new Error(
      'Não é possível excluir influenciador com campanhas, cupons ou pedidos vinculados. Desative-o.',
    );
  }

  await prisma.influencer.delete({ where: { id } });
}

export async function countInfluencerReferences(id: string) {
  const [campaigns, coupons, orders] = await Promise.all([
    prisma.campaign.count({ where: { influencerId: id } }),
    prisma.coupon.count({ where: { influencerId: id } }),
    prisma.order.count({ where: { influencerId: id } }),
  ]);
  return { campaigns, coupons, orders };
}
