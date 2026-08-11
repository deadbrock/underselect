import { prisma } from '@infrastructure/database';
import {
  mapCampaignToCreate,
  mapCampaignToDomain,
} from '@infrastructure/database/mappers/marketing.mapper';
import type { AdminCampaignStatus } from '@shared/types/marketing-admin.types';

const campaignInclude = {
  coupons: { select: { id: true } },
} as const;

export async function listCampaigns(filters?: {
  search?: string;
  status?: string;
  influencerId?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  if (filters?.influencerId) {
    where.influencerId = filters.influencerId;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  const records = await prisma.campaign.findMany({
    where,
    include: campaignInclude,
    orderBy: [{ startDate: 'desc' }],
  });

  return records.map(mapCampaignToDomain);
}

export async function getCampaignById(id: string) {
  const record = await prisma.campaign.findUnique({
    where: { id },
    include: campaignInclude,
  });
  return record ? mapCampaignToDomain(record) : null;
}

export async function createCampaign(
  input: Parameters<typeof mapCampaignToCreate>[0],
) {
  const record = await prisma.campaign.create({
    data: mapCampaignToCreate(input),
    include: campaignInclude,
  });
  return mapCampaignToDomain(record);
}

export async function updateCampaign(
  id: string,
  input: Parameters<typeof mapCampaignToCreate>[0],
) {
  const record = await prisma.campaign.update({
    where: { id },
    data: mapCampaignToCreate(input),
    include: campaignInclude,
  });
  return mapCampaignToDomain(record);
}

export async function toggleCampaignStatus(id: string) {
  const current = await prisma.campaign.findUniqueOrThrow({ where: { id } });
  let next = current.status;
  if (current.status === 'active') next = 'paused';
  else if (current.status === 'paused') next = 'active';

  const record = await prisma.campaign.update({
    where: { id },
    data: { status: next },
    include: campaignInclude,
  });
  return mapCampaignToDomain(record);
}

export async function syncCampaignCoupons(
  campaignId: string,
  couponIds: string[],
) {
  await prisma.coupon.updateMany({
    where: { campaignId },
    data: { campaignId: null },
  });

  if (couponIds.length > 0) {
    await prisma.coupon.updateMany({
      where: { id: { in: couponIds } },
      data: { campaignId },
    });
  }
}

export async function deleteCampaign(id: string) {
  const [, orders] = await Promise.all([
    prisma.coupon.count({ where: { campaignId: id } }),
    prisma.order.count({ where: { campaignId: id } }),
  ]);

  if (orders > 0) {
    throw new Error('Não é possível excluir campanha com pedidos vinculados.');
  }

  await prisma.coupon.updateMany({
    where: { campaignId: id },
    data: { campaignId: null },
  });

  await prisma.campaign.delete({ where: { id } });
}

export async function ensureInfluencerExists(influencerId: string) {
  const count = await prisma.influencer.count({ where: { id: influencerId } });
  if (count === 0) throw new Error('Influenciador não encontrado.');
}

export type { AdminCampaignStatus };
