import type {
  AdminCampaign,
  AdminCoupon,
  AdminInfluencer,
  CampaignFormInput,
  CouponAttribution,
  CouponFormInput,
  InfluencerFormInput,
  MarketingDashboardStats,
} from '@shared/types/marketing-admin.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message ?? 'Falha na requisição.');
  }
  return payload.data;
}

export async function fetchInfluencers(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`/api/admin/marketing/influencers${qs}`, {
    cache: 'no-store',
  });
  return parseApiResponse<AdminInfluencer[]>(response);
}

export async function createInfluencerApi(input: InfluencerFormInput) {
  const response = await fetch('/api/admin/marketing/influencers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminInfluencer>(response);
}

export async function updateInfluencerApi(
  id: string,
  input: InfluencerFormInput,
) {
  const response = await fetch(`/api/admin/marketing/influencers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminInfluencer>(response);
}

export async function toggleInfluencerStatusApi(id: string) {
  const response = await fetch(`/api/admin/marketing/influencers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle-status' }),
  });
  return parseApiResponse<AdminInfluencer>(response);
}

export async function deleteInfluencerApi(id: string) {
  const response = await fetch(`/api/admin/marketing/influencers/${id}`, {
    method: 'DELETE',
  });
  return parseApiResponse<{ deleted: boolean }>(response);
}

export async function fetchCampaigns(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`/api/admin/marketing/campaigns${qs}`, {
    cache: 'no-store',
  });
  return parseApiResponse<AdminCampaign[]>(response);
}

export async function createCampaignApi(input: CampaignFormInput) {
  const response = await fetch('/api/admin/marketing/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminCampaign>(response);
}

export async function updateCampaignApi(id: string, input: CampaignFormInput) {
  const response = await fetch(`/api/admin/marketing/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminCampaign>(response);
}

export async function toggleCampaignStatusApi(id: string) {
  const response = await fetch(`/api/admin/marketing/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle-status' }),
  });
  return parseApiResponse<AdminCampaign>(response);
}

export async function deleteCampaignApi(id: string) {
  const response = await fetch(`/api/admin/marketing/campaigns/${id}`, {
    method: 'DELETE',
  });
  return parseApiResponse<{ deleted: boolean }>(response);
}

export async function fetchCoupons(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`/api/admin/marketing/coupons${qs}`, {
    cache: 'no-store',
  });
  return parseApiResponse<AdminCoupon[]>(response);
}

export async function createCouponApi(input: CouponFormInput) {
  const response = await fetch('/api/admin/marketing/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminCoupon>(response);
}

export async function updateCouponApi(id: string, input: CouponFormInput) {
  const response = await fetch(`/api/admin/marketing/coupons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AdminCoupon>(response);
}

export async function toggleCouponStatusApi(id: string) {
  const response = await fetch(`/api/admin/marketing/coupons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle-status' }),
  });
  return parseApiResponse<AdminCoupon>(response);
}

export async function deleteCouponApi(id: string) {
  const response = await fetch(`/api/admin/marketing/coupons/${id}`, {
    method: 'DELETE',
  });
  return parseApiResponse<{ deleted: boolean }>(response);
}

export async function fetchMarketingDashboard(period?: string) {
  const qs = period ? `?period=${period}` : '';
  const response = await fetch(`/api/admin/marketing/dashboard${qs}`, {
    cache: 'no-store',
  });
  return parseApiResponse<{
    stats: MarketingDashboardStats;
    recentAttributions: CouponAttribution[];
    charts: {
      topCoupons: { label: string; value: number }[];
      revenueByInfluencer: { label: string; value: number }[];
    };
  }>(response);
}

export async function fetchCouponReport(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`/api/admin/marketing/reports/coupons${qs}`, {
    cache: 'no-store',
  });
  return parseApiResponse<
    {
      id: string;
      code: string;
      type: string;
      campaign: string;
      influencer: string;
      usages: number;
      usageLimit: number | null;
      orders: number;
      revenue: number;
      discount: number;
      startDate: string;
      endDate: string;
      status: string;
    }[]
  >(response);
}

export async function fetchInfluencerReport(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(
    `/api/admin/marketing/reports/influencers${qs}`,
    { cache: 'no-store' },
  );
  return parseApiResponse<
    {
      influencerId: string;
      influencer: string;
      identifierCode: string;
      status: string;
      campaigns: number;
      coupons: number;
      usages: number;
      orders: number;
      revenue: number;
      discount: number;
      averageTicket: number;
      mainCampaign: string;
    }[]
  >(response);
}

export async function validateCouponApi(input: {
  code: string;
  items: {
    productId: string;
    variationId?: string;
    categoryId?: string;
    categorySlug?: string;
    quantity: number;
    unitPrice: number;
  }[];
  customerCpf?: string;
}) {
  const response = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as ApiResponse<{
    valid: boolean;
    coupon?: {
      id: string;
      code: string;
      type: string;
      value: number;
      label: string;
      category?: string;
    };
    discountAmount?: number;
    feedback: { type: string; message: string };
  }>;
  if (!payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Falha ao validar cupom.');
  }
  return payload.data;
}

export async function createOrderApi(input: Record<string, unknown>) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseApiResponse<{
    orderId: string;
    orderNumber: string;
    total: number;
    couponDiscount: number;
    createdAt: string;
  }>(response);
}
