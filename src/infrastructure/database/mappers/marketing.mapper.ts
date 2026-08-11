import type { Prisma } from '@prisma/client';
import type {
  AdminCampaign,
  AdminCampaignStatus,
  AdminCoupon,
  AdminCouponRules,
  AdminCouponStatus,
  AdminInfluencer,
  AdminInfluencerStatus,
  CouponAttribution,
} from '@shared/types/marketing-admin.types';

interface DbTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface DbInfluencer extends DbTimestamps {
  id: string;
  name: string;
  publicName: string;
  email: string;
  phone: string;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  identifierCode: string;
  status: string;
  notes: string | null;
}

export interface DbCampaign extends DbTimestamps {
  id: string;
  name: string;
  description: string | null;
  influencerId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  objective: string | null;
  ordersGoal: number | null;
  salesGoal: { toString(): string } | number | null;
  notes: string | null;
  categoryIds: string[];
  productIds: string[];
  coupons?: { id: string }[];
}

export interface DbCoupon extends DbTimestamps {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: string;
  discountValue: { toString(): string } | number;
  startDate: Date;
  endDate: Date;
  usageLimit: number | null;
  usageLimitPerCustomer: number | null;
  status: string;
  campaignId: string | null;
  influencerId: string | null;
  rules: unknown;
  categoryIds: string[];
  productIds: string[];
  variationIds: string[];
  usageCount: number;
}

export interface DbRedemption {
  id: string;
  couponId: string;
  orderId: string;
  customerId: string | null;
  influencerId: string | null;
  campaignId: string | null;
  discountAmount: { toString(): string } | number;
  orderTotal: { toString(): string } | number;
  createdAt: Date;
  order: { number: string; total: { toString(): string } | number };
  customer?: { firstName: string; lastName: string } | null;
}

function toIso(date: Date): string {
  return date.toISOString();
}

function toNumber(value: { toString(): string } | number): number {
  return typeof value === 'number' ? value : Number(value);
}

function parseRules(rules: unknown): AdminCouponRules {
  if (!rules || typeof rules !== 'object') return {};
  const r = rules as Record<string, unknown>;
  return {
    minOrderValue:
      typeof r.minOrderValue === 'number' ? r.minOrderValue : undefined,
    categorySlug:
      typeof r.categorySlug === 'string' ? r.categorySlug : undefined,
    productId: typeof r.productId === 'string' ? r.productId : undefined,
    firstPurchaseOnly:
      typeof r.firstPurchaseOnly === 'boolean'
        ? r.firstPurchaseOnly
        : undefined,
    minQuantity: typeof r.minQuantity === 'number' ? r.minQuantity : undefined,
    freeShipping:
      typeof r.freeShipping === 'boolean' ? r.freeShipping : undefined,
  };
}

function serializeRules(rules: AdminCouponRules): Prisma.InputJsonValue {
  return { ...rules } as Prisma.InputJsonValue;
}

export function resolveCouponStatus(coupon: DbCoupon): AdminCouponStatus {
  if (coupon.status === 'paused') return 'paused';
  const now = Date.now();
  if (now < coupon.startDate.getTime()) return 'scheduled';
  if (now > coupon.endDate.getTime()) return 'expired';
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return 'depleted';
  }
  return coupon.status === 'active' ? 'active' : 'paused';
}

export function resolveCampaignStatus(
  campaign: DbCampaign,
): AdminCampaignStatus {
  if (campaign.status === 'paused') return 'paused';
  if (campaign.status === 'finished') return 'finished';
  const now = Date.now();
  if (now > campaign.endDate.getTime()) return 'finished';
  if (campaign.status === 'planned' && now >= campaign.startDate.getTime()) {
    return 'active';
  }
  if (campaign.status === 'active') return 'active';
  return campaign.status as AdminCampaignStatus;
}

export function mapInfluencerToDomain(record: DbInfluencer): AdminInfluencer {
  return {
    id: record.id,
    name: record.name,
    username: record.publicName,
    email: record.email,
    phone: record.phone,
    instagram: record.instagram ?? undefined,
    tiktok: record.tiktok ?? undefined,
    youtube: record.youtube ?? undefined,
    identifierCode: record.identifierCode,
    status: record.status as AdminInfluencerStatus,
    notes: record.notes ?? '',
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

export function mapInfluencerToCreate(input: {
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
  return {
    name: input.name,
    publicName: input.username,
    email: input.email,
    phone: input.phone,
    instagram: input.instagram ?? null,
    tiktok: input.tiktok ?? null,
    youtube: input.youtube ?? null,
    identifierCode: input.identifierCode.toUpperCase(),
    status: input.status,
    notes: input.notes || null,
  };
}

export function mapCampaignToDomain(record: DbCampaign): AdminCampaign {
  return {
    id: record.id,
    name: record.name,
    description: record.description ?? '',
    influencerId: record.influencerId,
    couponIds: record.coupons?.map((c) => c.id) ?? [],
    startDate: record.startDate.toISOString().slice(0, 10),
    endDate: record.endDate.toISOString().slice(0, 10),
    status: resolveCampaignStatus(record),
    objective: record.objective ?? '',
    notes: record.notes ?? '',
    productIds: record.productIds,
    salesGoal: record.salesGoal ? toNumber(record.salesGoal) : undefined,
    ordersGoal: record.ordersGoal ?? undefined,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

export function mapCampaignToCreate(input: {
  name: string;
  description: string;
  influencerId: string;
  startDate: string;
  endDate: string;
  status: AdminCampaignStatus;
  objective: string;
  notes: string;
  productIds: string[];
  salesGoal?: number;
  ordersGoal?: number;
}) {
  return {
    name: input.name,
    description: input.description || null,
    influencerId: input.influencerId,
    startDate: new Date(`${input.startDate}T00:00:00.000Z`),
    endDate: new Date(`${input.endDate}T23:59:59.999Z`),
    status: input.status,
    objective: input.objective || null,
    notes: input.notes || null,
    productIds: input.productIds,
    categoryIds: [] as string[],
    salesGoal: input.salesGoal ?? null,
    ordersGoal: input.ordersGoal ?? null,
  };
}

export function mapCouponToDomain(record: DbCoupon): AdminCoupon {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    description: record.description ?? '',
    discountType: record.discountType as AdminCoupon['discountType'],
    value: toNumber(record.discountValue),
    startDate: record.startDate.toISOString().slice(0, 10),
    endDate: record.endDate.toISOString().slice(0, 10),
    usageLimit: record.usageLimit ?? undefined,
    usageLimitPerCustomer: record.usageLimitPerCustomer ?? undefined,
    status: resolveCouponStatus(record),
    influencerId: record.influencerId ?? undefined,
    campaignId: record.campaignId ?? undefined,
    rules: parseRules(record.rules),
    usageCount: record.usageCount,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

export function mapCouponToCreate(input: {
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
  const rules = parseRules(input.rules);
  const productIds =
    input.productIds ?? (rules.productId ? [rules.productId] : []);

  return {
    code: input.code.toUpperCase(),
    name: input.name,
    description: input.description || null,
    discountType: input.discountType,
    discountValue: input.value,
    startDate: new Date(`${input.startDate}T00:00:00.000Z`),
    endDate: new Date(`${input.endDate}T23:59:59.999Z`),
    usageLimit: input.usageLimit ?? null,
    usageLimitPerCustomer: input.usageLimitPerCustomer ?? null,
    status: input.status,
    influencerId: input.influencerId || null,
    campaignId: input.campaignId || null,
    rules: serializeRules(rules),
    categoryIds: input.categoryIds ?? [],
    productIds,
    variationIds: input.variationIds ?? [],
  };
}

export function mapRedemptionToAttribution(
  record: DbRedemption,
): CouponAttribution {
  const customerName = record.customer
    ? `${record.customer.firstName} ${record.customer.lastName}`.trim()
    : 'Cliente';

  return {
    id: record.id,
    influencerId: record.influencerId ?? undefined,
    campaignId: record.campaignId ?? undefined,
    couponId: record.couponId,
    orderId: record.orderId,
    orderNumber: record.order.number,
    customerId: record.customerId ?? '',
    customerName,
    orderTotal: toNumber(record.orderTotal),
    discountAmount: toNumber(record.discountAmount),
    attributedRevenue: toNumber(record.orderTotal),
    createdAt: toIso(record.createdAt),
  };
}

export { parseRules, serializeRules, toNumber };
