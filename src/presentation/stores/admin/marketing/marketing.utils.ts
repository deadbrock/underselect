import { MARKETING_PAGE_SIZE } from '@shared/constants/marketing-admin.constants';
import { MOCK_COUPONS } from '@shared/constants/cart.constants';
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

const NOW = '2026-08-01T12:00:00.000Z';

export function buildInitialInfluencers(): AdminInfluencer[] {
  return [
    {
      id: 'inf-1',
      name: 'Douglas Silva',
      username: '@douglasfit',
      email: 'douglas@parceiros.com',
      phone: '11987654321',
      instagram: '@douglasfit',
      tiktok: '@douglasfit',
      identifierCode: 'DOUGLAS20',
      status: 'active',
      notes: 'Parceiro fitness — foco em camisetas premium.',
      createdAt: '2025-12-01T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'inf-2',
      name: 'Ana Beatriz',
      username: '@anabeats',
      email: 'ana@creators.com',
      phone: '21976543210',
      instagram: '@anabeats',
      youtube: '@anabeats',
      identifierCode: 'ANA10',
      status: 'active',
      notes: 'Lifestyle e moda esportiva.',
      createdAt: '2026-01-15T14:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'inf-3',
      name: 'João Pedro',
      username: '@joaofutebol',
      email: 'joao@futebol.com',
      phone: '31965432109',
      instagram: '@joaofutebol',
      tiktok: '@joaofutebol',
      identifierCode: 'JOAO15',
      status: 'active',
      notes: 'Conteúdo de clubes brasileiros.',
      createdAt: '2026-02-20T09:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'inf-4',
      name: 'Canal Flamengo FC',
      username: '@flamengofc',
      email: 'parceria@flamengo.com',
      phone: '21999887766',
      instagram: '@flamengofc',
      identifierCode: 'FLA10',
      status: 'active',
      notes: 'Canal oficial parceiro — alta conversão.',
      createdAt: '2025-06-01T08:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'inf-5',
      name: 'Verdão Store',
      username: '@verdaostore',
      email: 'contato@verdaostore.com',
      phone: '11988776655',
      instagram: '@verdaostore',
      identifierCode: 'PALMEIRAS',
      status: 'inactive',
      notes: 'Campanha pausada temporariamente.',
      createdAt: '2025-08-10T11:00:00.000Z',
      updatedAt: NOW,
    },
  ];
}

export function buildInitialCampaigns(): AdminCampaign[] {
  return [
    {
      id: 'camp-1',
      name: 'Verão Premium 2026',
      description: 'Campanha de verão com foco em camisetas exclusivas.',
      influencerId: 'inf-1',
      couponIds: ['coup-1', 'coup-2'],
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      status: 'active',
      objective: 'Aumentar vendas de camisetas premium em 25%',
      notes: 'Priorizar stories e reels.',
      categorySlug: 'casual-esportiva',
      productIds: [],
      salesGoal: 50000,
      ordersGoal: 120,
      createdAt: '2026-05-15T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'camp-2',
      name: 'Clubes BR — Flamengo',
      description: 'Promoção exclusiva para torcedores rubro-negros.',
      influencerId: 'inf-4',
      couponIds: ['coup-3', 'coup-4'],
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      status: 'active',
      objective: 'Conversão em clubes brasileiros',
      notes: '',
      categorySlug: 'clubes-brasileiros',
      productIds: [],
      salesGoal: 80000,
      ordersGoal: 200,
      createdAt: '2026-06-20T14:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'camp-3',
      name: 'Lançamento Ana Beats',
      description: 'Cupom de lançamento para seguidores.',
      influencerId: 'inf-2',
      couponIds: ['coup-5'],
      startDate: '2026-08-01',
      endDate: '2026-08-15',
      status: 'planned',
      objective: 'Awareness e primeiras vendas',
      notes: 'Aguardando aprovação de criativos.',
      productIds: [],
      salesGoal: 15000,
      ordersGoal: 40,
      createdAt: '2026-07-25T09:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'camp-4',
      name: 'Black Friday Antecipada',
      description: 'Campanha encerrada — referência histórica.',
      influencerId: 'inf-3',
      couponIds: ['coup-6'],
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      status: 'finished',
      objective: 'Volume de pedidos',
      notes: '',
      productIds: [],
      salesGoal: 100000,
      ordersGoal: 300,
      createdAt: '2025-10-15T10:00:00.000Z',
      updatedAt: '2025-12-01T10:00:00.000Z',
    },
  ];
}

export function buildInitialCoupons(): AdminCoupon[] {
  const cart = MOCK_COUPONS;
  return [
    {
      id: 'coup-1',
      code: 'DOUGLAS20',
      name: 'Douglas 20%',
      description: '20% de desconto — parceiro Douglas',
      discountType: 'percent',
      value: 20,
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      usageLimit: 500,
      usageLimitPerCustomer: 1,
      status: 'active',
      influencerId: 'inf-1',
      campaignId: 'camp-1',
      rules: { minOrderValue: 150 },
      usageCount: 87,
      createdAt: '2026-05-15T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-2',
      code: 'UNDER10',
      name: 'UNDER 10%',
      description: cart.UNDER10.label,
      discountType: 'percent',
      value: 10,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 1000,
      usageLimitPerCustomer: 3,
      status: 'active',
      influencerId: 'inf-1',
      campaignId: 'camp-1',
      rules: {},
      usageCount: 342,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-3',
      code: 'FLA10',
      name: 'Flamengo 10%',
      description: '10% para torcedores',
      discountType: 'percent',
      value: 10,
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      usageLimit: 300,
      usageLimitPerCustomer: 2,
      status: 'active',
      influencerId: 'inf-4',
      campaignId: 'camp-2',
      rules: { categorySlug: 'clubes-brasileiros' },
      usageCount: 156,
      createdAt: '2026-06-20T14:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-4',
      code: 'FLAMENGO15',
      name: 'Flamengo 15% Categoria',
      description: cart.FLAMENGO15.label,
      discountType: 'category',
      value: 15,
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      usageLimit: 200,
      status: 'active',
      influencerId: 'inf-4',
      campaignId: 'camp-2',
      rules: { categorySlug: 'clubes-brasileiros', minOrderValue: 200 },
      usageCount: 64,
      createdAt: '2026-06-25T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-5',
      code: 'ANA10',
      name: 'Ana 10%',
      description: '10% — lançamento Ana Beats',
      discountType: 'percent',
      value: 10,
      startDate: '2026-08-01',
      endDate: '2026-08-15',
      usageLimit: 100,
      usageLimitPerCustomer: 1,
      status: 'scheduled',
      influencerId: 'inf-2',
      campaignId: 'camp-3',
      rules: { firstPurchaseOnly: true },
      usageCount: 0,
      createdAt: '2026-07-25T09:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-6',
      code: 'JOAO15',
      name: 'João 15%',
      description: '15% — campanha encerrada',
      discountType: 'percent',
      value: 15,
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      usageLimit: 150,
      status: 'expired',
      influencerId: 'inf-3',
      campaignId: 'camp-4',
      rules: {},
      usageCount: 148,
      createdAt: '2025-10-15T10:00:00.000Z',
      updatedAt: '2025-12-01T10:00:00.000Z',
    },
    {
      id: 'coup-7',
      code: 'BEMVINDO',
      name: 'Bem-vindo',
      description: cart.BEMVINDO.label,
      discountType: 'first-purchase',
      value: 15,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 5000,
      usageLimitPerCustomer: 1,
      status: 'active',
      rules: { firstPurchaseOnly: true },
      usageCount: 890,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-8',
      code: 'FRETEGRATIS',
      name: 'Frete Grátis',
      description: cart.FRETEGRATIS.label,
      discountType: 'free-shipping',
      value: 0,
      startDate: '2026-03-01',
      endDate: '2026-08-31',
      usageLimit: 200,
      status: 'depleted',
      rules: { freeShipping: true, minOrderValue: 299 },
      usageCount: 200,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: NOW,
    },
    {
      id: 'coup-9',
      code: 'ECONOMIZE50',
      name: 'Economize R$50',
      description: cart.ECONOMIZE50.label,
      discountType: 'fixed',
      value: 50,
      startDate: '2026-04-01',
      endDate: '2026-10-31',
      usageLimit: 100,
      usageLimitPerCustomer: 1,
      status: 'paused',
      rules: { minOrderValue: 350 },
      usageCount: 23,
      createdAt: '2026-04-01T10:00:00.000Z',
      updatedAt: NOW,
    },
  ];
}

export function buildInitialAttributions(): CouponAttribution[] {
  return [
    {
      id: 'attr-1',
      influencerId: 'inf-1',
      campaignId: 'camp-1',
      couponId: 'coup-1',
      orderId: 'ord-1',
      orderNumber: 'US-MOCK001',
      customerId: 'cust-1',
      customerName: 'Rafael Souza',
      orderTotal: 449.9,
      discountAmount: 89.98,
      attributedRevenue: 359.92,
      createdAt: '2026-07-28T14:30:00.000Z',
    },
    {
      id: 'attr-2',
      influencerId: 'inf-4',
      campaignId: 'camp-2',
      couponId: 'coup-3',
      orderId: 'ord-2',
      orderNumber: 'US-MOCK002',
      customerId: 'cust-2',
      customerName: 'Ana Paula Lima',
      orderTotal: 630.0,
      discountAmount: 63.0,
      attributedRevenue: 567.0,
      createdAt: '2026-08-10T10:00:00.000Z',
    },
    {
      id: 'attr-3',
      influencerId: 'inf-1',
      campaignId: 'camp-1',
      couponId: 'coup-2',
      orderId: 'ord-3',
      orderNumber: 'US-MOCK003',
      customerId: 'cust-1',
      customerName: 'Rafael Souza',
      orderTotal: 538.0,
      discountAmount: 53.8,
      attributedRevenue: 484.2,
      createdAt: '2026-08-15T18:45:00.000Z',
    },
    {
      id: 'attr-4',
      influencerId: 'inf-4',
      campaignId: 'camp-2',
      couponId: 'coup-4',
      orderId: 'ord-4',
      orderNumber: 'US-MOCK004',
      customerId: 'cust-3',
      customerName: 'Carlos Mendes',
      orderTotal: 459.9,
      discountAmount: 68.99,
      attributedRevenue: 390.91,
      createdAt: '2026-08-01T09:30:00.000Z',
    },
    {
      id: 'attr-5',
      influencerId: 'inf-3',
      campaignId: 'camp-4',
      couponId: 'coup-6',
      orderId: 'ord-5',
      orderNumber: 'US-MOCK005',
      customerId: 'cust-5',
      customerName: 'Pedro Alves',
      orderTotal: 890.0,
      discountAmount: 133.5,
      attributedRevenue: 756.5,
      createdAt: '2025-11-20T16:00:00.000Z',
    },
  ];
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
  return [
    { label: 'Jan', value: 45 },
    { label: 'Fev', value: 62 },
    { label: 'Mar', value: 58 },
    { label: 'Abr', value: 71 },
    { label: 'Mai', value: 89 },
    { label: 'Jun', value: 102 },
    { label: 'Jul', value: 118 },
  ];
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
