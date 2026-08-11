'use client';

import { create } from 'zustand';

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

import {
  createCampaignApi,
  createCouponApi,
  createInfluencerApi,
  deleteCampaignApi,
  deleteCouponApi,
  deleteInfluencerApi,
  fetchCampaigns,
  fetchCoupons,
  fetchInfluencers,
  fetchMarketingDashboard,
  toggleCampaignStatusApi,
  toggleCouponStatusApi,
  toggleInfluencerStatusApi,
  updateCampaignApi,
  updateCouponApi,
  updateInfluencerApi,
} from './marketing.api';
import { computeInfluencerMetrics } from './marketing.utils';

interface MarketingState {
  influencers: AdminInfluencer[];
  campaigns: AdminCampaign[];
  coupons: AdminCoupon[];
  attributions: CouponAttribution[];
  dashboardStats: MarketingDashboardStats | null;
  dashboardCharts: {
    topCoupons: { label: string; value: number }[];
    revenueByInfluencer: { label: string; value: number }[];
  } | null;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
}

interface MarketingActions {
  hydrate: () => Promise<void>;
  loadDashboard: (period?: string) => Promise<void>;
  getInfluencerById: (id: string) => AdminInfluencer | undefined;
  getCampaignById: (id: string) => AdminCampaign | undefined;
  getCouponById: (id: string) => AdminCoupon | undefined;
  getInfluencerMetrics: (
    id: string,
  ) => ReturnType<typeof computeInfluencerMetrics> | undefined;
  getAttributionsByInfluencer: (id: string) => CouponAttribution[];
  getAttributionsByCampaign: (id: string) => CouponAttribution[];
  getAttributionsByCoupon: (id: string) => CouponAttribution[];
  getCouponsByInfluencer: (id: string) => AdminCoupon[];
  getCouponsByCampaign: (id: string) => AdminCoupon[];
  getCampaignsByInfluencer: (id: string) => AdminCampaign[];
  createInfluencer: (input: InfluencerFormInput) => Promise<AdminInfluencer>;
  updateInfluencer: (id: string, input: InfluencerFormInput) => Promise<void>;
  toggleInfluencerStatus: (id: string) => Promise<void>;
  deleteInfluencer: (id: string) => Promise<void>;
  createCampaign: (input: CampaignFormInput) => Promise<AdminCampaign>;
  updateCampaign: (id: string, input: CampaignFormInput) => Promise<void>;
  toggleCampaignStatus: (id: string) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  createCoupon: (input: CouponFormInput) => Promise<AdminCoupon>;
  updateCoupon: (id: string, input: CouponFormInput) => Promise<void>;
  toggleCouponStatus: (id: string) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

export type MarketingStore = MarketingState & MarketingActions;

export const useMarketingStore = create<MarketingStore>((set, get) => ({
  influencers: [],
  campaigns: [],
  coupons: [],
  attributions: [],
  dashboardStats: null,
  dashboardCharts: null,
  loading: false,
  hydrated: false,
  error: null,

  hydrate: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [influencers, campaigns, coupons, dashboard] = await Promise.all([
        fetchInfluencers(),
        fetchCampaigns(),
        fetchCoupons(),
        fetchMarketingDashboard(),
      ]);
      set({
        influencers,
        campaigns,
        coupons,
        attributions: dashboard.recentAttributions,
        dashboardStats: dashboard.stats,
        dashboardCharts: dashboard.charts,
        hydrated: true,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao carregar marketing.',
      });
    } finally {
      set({ loading: false });
    }
  },

  loadDashboard: async (period) => {
    const dashboard = await fetchMarketingDashboard(period);
    set({
      dashboardStats: dashboard.stats,
      dashboardCharts: dashboard.charts,
      attributions: dashboard.recentAttributions,
    });
  },

  getInfluencerById: (id) => get().influencers.find((i) => i.id === id),
  getCampaignById: (id) => get().campaigns.find((c) => c.id === id),
  getCouponById: (id) => get().coupons.find((c) => c.id === id),

  getInfluencerMetrics: (id) => {
    const inf = get().getInfluencerById(id);
    if (!inf) return undefined;
    return computeInfluencerMetrics(
      id,
      get().campaigns,
      get().coupons,
      get().attributions,
      inf,
    );
  },

  getAttributionsByInfluencer: (id) =>
    get().attributions.filter((a) => a.influencerId === id),
  getAttributionsByCampaign: (id) =>
    get().attributions.filter((a) => a.campaignId === id),
  getAttributionsByCoupon: (id) =>
    get().attributions.filter((a) => a.couponId === id),
  getCouponsByInfluencer: (id) =>
    get().coupons.filter((c) => c.influencerId === id),
  getCouponsByCampaign: (id) =>
    get().coupons.filter((c) => c.campaignId === id),
  getCampaignsByInfluencer: (id) =>
    get().campaigns.filter((c) => c.influencerId === id),

  createInfluencer: async (input) => {
    const influencer = await createInfluencerApi(input);
    set((s) => ({ influencers: [influencer, ...s.influencers] }));
    return influencer;
  },

  updateInfluencer: async (id, input) => {
    const influencer = await updateInfluencerApi(id, input);
    set((s) => ({
      influencers: s.influencers.map((i) => (i.id === id ? influencer : i)),
    }));
  },

  toggleInfluencerStatus: async (id) => {
    const influencer = await toggleInfluencerStatusApi(id);
    set((s) => ({
      influencers: s.influencers.map((i) => (i.id === id ? influencer : i)),
    }));
  },

  deleteInfluencer: async (id) => {
    await deleteInfluencerApi(id);
    set((s) => ({
      influencers: s.influencers.filter((i) => i.id !== id),
    }));
  },

  createCampaign: async (input) => {
    const campaign = await createCampaignApi(input);
    set((s) => ({ campaigns: [campaign, ...s.campaigns] }));
    return campaign;
  },

  updateCampaign: async (id, input) => {
    const campaign = await updateCampaignApi(id, input);
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? campaign : c)),
    }));
  },

  toggleCampaignStatus: async (id) => {
    const campaign = await toggleCampaignStatusApi(id);
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? campaign : c)),
    }));
  },

  deleteCampaign: async (id) => {
    await deleteCampaignApi(id);
    set((s) => ({
      campaigns: s.campaigns.filter((c) => c.id !== id),
    }));
  },

  createCoupon: async (input) => {
    const coupon = await createCouponApi(input);
    set((s) => ({ coupons: [coupon, ...s.coupons] }));
    return coupon;
  },

  updateCoupon: async (id, input) => {
    const coupon = await updateCouponApi(id, input);
    set((s) => ({
      coupons: s.coupons.map((c) => (c.id === id ? coupon : c)),
    }));
  },

  toggleCouponStatus: async (id) => {
    const coupon = await toggleCouponStatusApi(id);
    set((s) => ({
      coupons: s.coupons.map((c) => (c.id === id ? coupon : c)),
    }));
  },

  deleteCoupon: async (id) => {
    await deleteCouponApi(id);
    set((s) => ({
      coupons: s.coupons.filter((c) => c.id !== id),
    }));
  },
}));
