import type { CatalogCategorySlug } from '@shared/types/catalog.types';

export type AdminInfluencerStatus = 'active' | 'inactive';

export type AdminCampaignStatus = 'planned' | 'active' | 'finished' | 'paused';

export type AdminCouponStatus =
  'active' | 'scheduled' | 'expired' | 'paused' | 'depleted';

export type AdminCouponDiscountType =
  | 'percent'
  | 'fixed'
  | 'free-shipping'
  | 'first-purchase'
  | 'category'
  | 'product'
  | 'min-order';

export type InfluencerChannel = 'instagram' | 'tiktok' | 'youtube';

export interface AdminInfluencer {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface AdminCampaign {
  id: string;
  name: string;
  description: string;
  influencerId: string;
  couponIds: string[];
  startDate: string;
  endDate: string;
  status: AdminCampaignStatus;
  objective: string;
  notes: string;
  categorySlug?: CatalogCategorySlug;
  productIds: string[];
  salesGoal?: number;
  ordersGoal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCouponRules {
  minOrderValue?: number;
  categorySlug?: CatalogCategorySlug;
  productId?: string;
  firstPurchaseOnly?: boolean;
  minQuantity?: number;
  freeShipping?: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: AdminCouponDiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  status: AdminCouponStatus;
  influencerId?: string;
  campaignId?: string;
  rules: AdminCouponRules;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponAttribution {
  id: string;
  influencerId?: string;
  campaignId?: string;
  couponId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderTotal: number;
  discountAmount: number;
  attributedRevenue: number;
  createdAt: string;
}

export interface MarketingDashboardStats {
  activeCoupons: number;
  usedCoupons: number;
  activeCampaigns: number;
  activeInfluencers: number;
  ordersFromCoupons: number;
  attributedRevenue: number;
  totalDiscount: number;
  averageTicketWithCoupon: number;
}

export interface InfluencerListMetrics {
  influencerId: string;
  mainChannel: InfluencerChannel;
  campaignCount: number;
  couponCount: number;
  usageCount: number;
  orderCount: number;
  attributedRevenue: number;
  discountGenerated: number;
}

export interface InfluencerFilters {
  search: string;
  status: string;
  channel: string;
}

export interface CampaignFilters {
  search: string;
  status: string;
  influencerId: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CouponFilters {
  search: string;
  status: string;
  discountType: string;
  influencerId: string;
  campaignId: string;
  dateFrom?: string;
  dateTo?: string;
  usageMin?: number;
  revenueMin?: number;
}

export interface ReportFilters {
  search: string;
  influencerId: string;
  campaignId: string;
  couponId: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export type InfluencerSortOption =
  'name-asc' | 'revenue-desc' | 'orders-desc' | 'usage-desc';

export type CampaignSortOption = 'name-asc' | 'start-desc' | 'status-asc';

export type CouponSortOption =
  'code-asc' | 'usage-desc' | 'created-desc' | 'revenue-desc';

export interface InfluencerFormInput {
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
}

export interface CampaignFormInput {
  name: string;
  description: string;
  influencerId: string;
  couponIds: string[];
  startDate: string;
  endDate: string;
  status: AdminCampaignStatus;
  objective: string;
  notes: string;
  categorySlug?: CatalogCategorySlug;
  productIds: string[];
  salesGoal?: number;
  ordersGoal?: number;
}

export interface CouponFormInput {
  code: string;
  name: string;
  description: string;
  discountType: AdminCouponDiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  status: AdminCouponStatus;
  influencerId?: string;
  campaignId?: string;
  rules: AdminCouponRules;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
