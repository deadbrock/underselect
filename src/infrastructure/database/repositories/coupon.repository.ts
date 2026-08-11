import { prisma } from '@infrastructure/database';
import {
  mapCouponToCreate,
  mapCouponToDomain,
} from '@infrastructure/database/mappers/marketing.mapper';
import type { AdminCouponRules } from '@shared/types/marketing-admin.types';

export async function listCoupons(filters?: {
  search?: string;
  status?: string;
  discountType?: string;
  influencerId?: string;
  campaignId?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  if (filters?.discountType && filters.discountType !== 'all') {
    where.discountType = filters.discountType;
  }

  if (filters?.influencerId) {
    where.influencerId = filters.influencerId;
  }

  if (filters?.campaignId) {
    where.campaignId = filters.campaignId;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { code: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ];
  }

  const records = await prisma.coupon.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
  });

  return records.map(mapCouponToDomain);
}

export async function getCouponById(id: string) {
  const record = await prisma.coupon.findUnique({ where: { id } });
  return record ? mapCouponToDomain(record) : null;
}

export async function getCouponByCode(code: string) {
  const record = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
  return record ?? null;
}

export async function createCoupon(input: {
  code: string;
  name: string;
  description: string;
  discountType: string;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  status: string;
  influencerId?: string;
  campaignId?: string;
  rules: AdminCouponRules;
  categoryIds?: string[];
  productIds?: string[];
  variationIds?: string[];
}) {
  const record = await prisma.coupon.create({
    data: mapCouponToCreate(input),
  });
  return mapCouponToDomain(record);
}

export async function updateCoupon(
  id: string,
  input: Parameters<typeof mapCouponToCreate>[0],
) {
  const record = await prisma.coupon.update({
    where: { id },
    data: mapCouponToCreate(input),
  });
  return mapCouponToDomain(record);
}

export async function toggleCouponStatus(id: string) {
  const current = await prisma.coupon.findUniqueOrThrow({ where: { id } });
  let next = current.status;
  if (current.status === 'active') next = 'paused';
  else if (current.status === 'paused') next = 'active';

  const record = await prisma.coupon.update({
    where: { id },
    data: { status: next },
  });
  return mapCouponToDomain(record);
}

export async function deleteCoupon(id: string) {
  const [redemptions, orders] = await Promise.all([
    prisma.couponRedemption.count({ where: { couponId: id } }),
    prisma.order.count({ where: { couponId: id } }),
  ]);

  if (redemptions > 0 || orders > 0) {
    throw new Error('Não é possível excluir cupom já utilizado. Desative-o.');
  }

  await prisma.coupon.delete({ where: { id } });
}

export async function countCouponRedemptionsByCustomer(
  couponId: string,
  customerId: string,
) {
  return prisma.couponRedemption.count({
    where: { couponId, customerId },
  });
}

export async function incrementCouponUsageAtomic(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  couponId: string,
) {
  const coupon = await tx.coupon.findUniqueOrThrow({ where: { id: couponId } });

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error('Cupom esgotado.');
  }

  const result = await tx.coupon.updateMany({
    where: {
      id: couponId,
      usageCount: coupon.usageCount,
    },
    data: { usageCount: { increment: 1 } },
  });

  if (result.count === 0) {
    throw new Error('Cupom esgotado ou alterado por outra transação.');
  }

  const refreshed = await tx.coupon.findUniqueOrThrow({
    where: { id: couponId },
  });
  if (
    refreshed.usageLimit !== null &&
    refreshed.usageCount > refreshed.usageLimit
  ) {
    throw new Error('Cupom esgotado.');
  }
}

export async function ensureCouponCodeAvailable(
  code: string,
  excludeId?: string,
) {
  const existing = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (existing && existing.id !== excludeId) {
    throw new Error('Já existe um cupom com este código.');
  }
}
