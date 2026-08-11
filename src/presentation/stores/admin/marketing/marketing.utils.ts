import { MARKETING_PAGE_SIZE } from '@shared/constants/marketing-admin.constants';
import type {
  AdminCampaign,
  AdminCoupon,
  AdminInfluencer,
  CampaignFilters,
  CampaignSortOption,
  ChartDataPoint,
  CouponAttribution,
  CouponFilters,
  CouponSortOption,
  InfluencerFilters,
  InfluencerListMetrics,
  InfluencerSortOption,
  MarketingDashboardStats,
  ReportFilters,
} from '@shared/types/marketing-admin.types';

export function buildInitialInfluencers(): AdminInfluencer[] {
  return [];
}

export function buildInitialCampaigns(): AdminCampaign[] {
  return [];
}

export function buildInitialCoupons(): AdminCoupon[] {
  return [];
}

export function buildInitialAttributions(): CouponAttribution[] {
  return [];
}

export function getInfluencerMainChannel(
  inf: AdminInfluencer,
): InfluencerListMetrics['mainChannel'] {
  if (inf.instagram) return 'instagram';
  if (inf.tiktok) return 'tiktok';
  return 'youtube';
}

export function computeInfluencerMetrics(
  influencerId: string,
  campaigns: AdminCampaign[],
  coupons: AdminCoupon[],
  attributions: CouponAttribution[],
  influencer: AdminInfluencer,
): InfluencerListMetrics {
  const infCampaigns = campaigns.filter((c) => c.influencerId === influencerId);
  const infCoupons = coupons.filter((c) => c.influencerId === influencerId);
  const infAttrs = attributions.filter((a) => a.influencerId === influencerId);

  return {
    influencerId,
    mainChannel: getInfluencerMainChannel(influencer),
    campaignCount: infCampaigns.length,
    couponCount: infCoupons.length,
    usageCount: infCoupons.reduce((s, c) => s + c.usageCount, 0),
    orderCount: infAttrs.length,
    attributedRevenue: infAttrs.reduce((s, a) => s + a.attributedRevenue, 0),
    discountGenerated: infAttrs.reduce((s, a) => s + a.discountAmount, 0),
  };
}

export function getMarketingDashboardStats(
  influencers: AdminInfluencer[],
  campaigns: AdminCampaign[],
  coupons: AdminCoupon[],
  attributions: CouponAttribution[],
): MarketingDashboardStats {
  const activeCoupons = coupons.filter((c) => c.status === 'active').length;
  const usedCoupons = coupons.filter((c) => c.usageCount > 0).length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const activeInfluencers = influencers.filter(
    (i) => i.status === 'active',
  ).length;
  const totalDiscount = attributions.reduce((s, a) => s + a.discountAmount, 0);
  const attributedRevenue = attributions.reduce(
    (s, a) => s + a.attributedRevenue,
    0,
  );
  const ordersFromCoupons = attributions.length;
  const averageTicketWithCoupon =
    ordersFromCoupons > 0 ? attributedRevenue / ordersFromCoupons : 0;

  return {
    activeCoupons,
    usedCoupons,
    activeCampaigns,
    activeInfluencers,
    ordersFromCoupons,
    attributedRevenue,
    totalDiscount,
    averageTicketWithCoupon,
  };
}

export function getUsageChartData(): ChartDataPoint[] {
  return [];
}

export function getRevenueByInfluencerChart(
  influencers: AdminInfluencer[],
  attributions: CouponAttribution[],
): ChartDataPoint[] {
  return influencers
    .filter((i) => i.status === 'active')
    .slice(0, 5)
    .map((inf) => ({
      label: inf.name.split(' ')[0] ?? inf.name,
      value: attributions
        .filter((a) => a.influencerId === inf.id)
        .reduce((s, a) => s + a.attributedRevenue, 0),
    }));
}

export function getTopInfluencersChart(
  metrics: InfluencerListMetrics[],
): ChartDataPoint[] {
  return [...metrics]
    .sort((a, b) => b.attributedRevenue - a.attributedRevenue)
    .slice(0, 5)
    .map((m) => ({
      label: m.influencerId.replace('inf-', '#'),
      value: m.attributedRevenue,
    }));
}

export function getTopCouponsChart(coupons: AdminCoupon[]): ChartDataPoint[] {
  return [...coupons]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map((c) => ({ label: c.code, value: c.usageCount }));
}

export function getCampaignPerformanceChart(
  campaigns: AdminCampaign[],
  attributions: CouponAttribution[],
): ChartDataPoint[] {
  return campaigns
    .filter((c) => c.status === 'active' || c.status === 'finished')
    .map((c) => ({
      label: c.name.slice(0, 12),
      value: attributions
        .filter((a) => a.campaignId === c.id)
        .reduce((s, a) => s + a.attributedRevenue, 0),
    }));
}

export function filterInfluencers(
  influencers: AdminInfluencer[],
  filters: InfluencerFilters,
): AdminInfluencer[] {
  let result = [...influencers];
  const q = filters.search.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.username.toLowerCase().includes(q) ||
        i.identifierCode.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters.channel !== 'all') {
    result = result.filter((i) => {
      if (filters.channel === 'instagram') return !!i.instagram;
      if (filters.channel === 'tiktok') return !!i.tiktok;
      if (filters.channel === 'youtube') return !!i.youtube;
      return true;
    });
  }
  return result;
}

export function sortInfluencers(
  influencers: AdminInfluencer[],
  metrics: Map<string, InfluencerListMetrics>,
  sort: InfluencerSortOption,
): AdminInfluencer[] {
  const sorted = [...influencers];
  sorted.sort((a, b) => {
    const ma = metrics.get(a.id);
    const mb = metrics.get(b.id);
    switch (sort) {
      case 'revenue-desc':
        return (mb?.attributedRevenue ?? 0) - (ma?.attributedRevenue ?? 0);
      case 'orders-desc':
        return (mb?.orderCount ?? 0) - (ma?.orderCount ?? 0);
      case 'usage-desc':
        return (mb?.usageCount ?? 0) - (ma?.usageCount ?? 0);
      default:
        return a.name.localeCompare(b.name, 'pt-BR');
    }
  });
  return sorted;
}

export function filterCampaigns(
  campaigns: AdminCampaign[],
  filters: CampaignFilters,
): AdminCampaign[] {
  let result = [...campaigns];
  const q = filters.search.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    result = result.filter((c) => c.status === filters.status);
  }
  if (filters.influencerId !== 'all') {
    result = result.filter((c) => c.influencerId === filters.influencerId);
  }
  if (filters.dateFrom) {
    result = result.filter((c) => c.startDate >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    result = result.filter((c) => c.endDate <= filters.dateTo!);
  }
  return result;
}

export function sortCampaigns(
  campaigns: AdminCampaign[],
  sort: CampaignSortOption,
): AdminCampaign[] {
  const sorted = [...campaigns];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'start-desc':
        return b.startDate.localeCompare(a.startDate);
      case 'status-asc':
        return a.status.localeCompare(b.status);
      default:
        return a.name.localeCompare(b.name, 'pt-BR');
    }
  });
  return sorted;
}

export function filterCoupons(
  coupons: AdminCoupon[],
  filters: CouponFilters,
): AdminCoupon[] {
  let result = [...coupons];
  const q = filters.search.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    result = result.filter((c) => c.status === filters.status);
  }
  if (filters.discountType !== 'all') {
    result = result.filter((c) => c.discountType === filters.discountType);
  }
  if (filters.influencerId !== 'all') {
    result = result.filter((c) => c.influencerId === filters.influencerId);
  }
  if (filters.campaignId !== 'all') {
    result = result.filter((c) => c.campaignId === filters.campaignId);
  }
  if (filters.usageMin !== undefined && filters.usageMin > 0) {
    result = result.filter((c) => c.usageCount >= filters.usageMin!);
  }
  return result;
}

export function sortCoupons(
  coupons: AdminCoupon[],
  sort: CouponSortOption,
  attributions: CouponAttribution[],
): AdminCoupon[] {
  const revenueMap = new Map<string, number>();
  for (const a of attributions) {
    revenueMap.set(
      a.couponId,
      (revenueMap.get(a.couponId) ?? 0) + a.attributedRevenue,
    );
  }
  const sorted = [...coupons];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'usage-desc':
        return b.usageCount - a.usageCount;
      case 'created-desc':
        return b.createdAt.localeCompare(a.createdAt);
      case 'revenue-desc':
        return (revenueMap.get(b.id) ?? 0) - (revenueMap.get(a.id) ?? 0);
      default:
        return a.code.localeCompare(b.code);
    }
  });
  return sorted;
}

export function filterAttributions(
  attributions: CouponAttribution[],
  filters: ReportFilters,
): CouponAttribution[] {
  let result = [...attributions];
  const q = filters.search.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (a) =>
        a.orderNumber.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q),
    );
  }
  if (filters.influencerId !== 'all') {
    result = result.filter((a) => a.influencerId === filters.influencerId);
  }
  if (filters.campaignId !== 'all') {
    result = result.filter((a) => a.campaignId === filters.campaignId);
  }
  if (filters.couponId !== 'all') {
    result = result.filter((a) => a.couponId === filters.couponId);
  }
  if (filters.dateFrom) {
    result = result.filter((a) => a.createdAt >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    result = result.filter((a) => a.createdAt <= filters.dateTo!);
  }
  return result;
}

export function paginate<T>(items: T[], page: number): T[] {
  return items.slice(
    (page - 1) * MARKETING_PAGE_SIZE,
    page * MARKETING_PAGE_SIZE,
  );
}

export function getCouponRevenue(
  couponId: string,
  attributions: CouponAttribution[],
): number {
  return attributions
    .filter((a) => a.couponId === couponId)
    .reduce((s, a) => s + a.attributedRevenue, 0);
}

export function getCouponDiscount(
  couponId: string,
  attributions: CouponAttribution[],
): number {
  return attributions
    .filter((a) => a.couponId === couponId)
    .reduce((s, a) => s + a.discountAmount, 0);
}

export function getInfluencerPerformanceChart(
  influencerId: string,
  attributions: CouponAttribution[],
): ChartDataPoint[] {
  const months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  return months.map((label, i) => ({
    label,
    value: attributions
      .filter((a) => a.influencerId === influencerId)
      .slice(0, i + 1)
      .reduce((s, a) => s + a.attributedRevenue, 0),
  }));
}
