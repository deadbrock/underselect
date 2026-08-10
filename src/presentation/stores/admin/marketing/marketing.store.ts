'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { MARKETING_STORAGE_KEY } from '@shared/constants/marketing-admin.constants';
import type {
  AdminCampaign,
  AdminCoupon,
  AdminInfluencer,
  CampaignFormInput,
  CouponAttribution,
  CouponFormInput,
  InfluencerFormInput,
} from '@shared/types/marketing-admin.types';

import {
  buildInitialAttributions,
  buildInitialCampaigns,
  buildInitialCoupons,
  buildInitialInfluencers,
  computeInfluencerMetrics,
} from './marketing.utils';

interface MarketingState {
  influencers: AdminInfluencer[];
  campaigns: AdminCampaign[];
  coupons: AdminCoupon[];
  attributions: CouponAttribution[];
  initialized: boolean;
}

interface MarketingActions {
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
  createInfluencer: (input: InfluencerFormInput) => AdminInfluencer;
  updateInfluencer: (id: string, input: InfluencerFormInput) => void;
  toggleInfluencerStatus: (id: string) => void;
  createCampaign: (input: CampaignFormInput) => AdminCampaign;
  updateCampaign: (id: string, input: CampaignFormInput) => void;
  toggleCampaignStatus: (id: string) => void;
  createCoupon: (input: CouponFormInput) => AdminCoupon;
  updateCoupon: (id: string, input: CouponFormInput) => void;
  toggleCouponStatus: (id: string) => void;
}

export type MarketingStore = MarketingState & MarketingActions;

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set, get) => ({
      influencers: buildInitialInfluencers(),
      campaigns: buildInitialCampaigns(),
      coupons: buildInitialCoupons(),
      attributions: buildInitialAttributions(),
      initialized: true,

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

      createInfluencer: (input) => {
        const influencer: AdminInfluencer = {
          id: `inf-${Date.now()}`,
          ...input,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ influencers: [influencer, ...s.influencers] }));
        return influencer;
      },

      updateInfluencer: (id, input) => {
        set((s) => ({
          influencers: s.influencers.map((i) =>
            i.id === id ? { ...i, ...input, updatedAt: now() } : i,
          ),
        }));
      },

      toggleInfluencerStatus: (id) => {
        set((s) => ({
          influencers: s.influencers.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: i.status === 'active' ? 'inactive' : 'active',
                  updatedAt: now(),
                }
              : i,
          ),
        }));
      },

      createCampaign: (input) => {
        const campaign: AdminCampaign = {
          id: `camp-${Date.now()}`,
          ...input,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ campaigns: [campaign, ...s.campaigns] }));
        return campaign;
      },

      updateCampaign: (id, input) => {
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, ...input, updatedAt: now() } : c,
          ),
        }));
      },

      toggleCampaignStatus: (id) => {
        set((s) => ({
          campaigns: s.campaigns.map((c) => {
            if (c.id !== id) return c;
            const next =
              c.status === 'active'
                ? 'paused'
                : c.status === 'paused'
                  ? 'active'
                  : c.status;
            return { ...c, status: next, updatedAt: now() };
          }),
        }));
      },

      createCoupon: (input) => {
        const coupon: AdminCoupon = {
          id: `coup-${Date.now()}`,
          ...input,
          usageCount: 0,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ coupons: [coupon, ...s.coupons] }));
        return coupon;
      },

      updateCoupon: (id, input) => {
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.id === id ? { ...c, ...input, updatedAt: now() } : c,
          ),
        }));
      },

      toggleCouponStatus: (id) => {
        set((s) => ({
          coupons: s.coupons.map((c) => {
            if (c.id !== id) return c;
            const next =
              c.status === 'active'
                ? 'paused'
                : c.status === 'paused'
                  ? 'active'
                  : c.status;
            return { ...c, status: next, updatedAt: now() };
          }),
        }));
      },
    }),
    {
      name: MARKETING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        influencers: state.influencers,
        campaigns: state.campaigns,
        coupons: state.coupons,
        attributions: state.attributions,
        initialized: state.initialized,
      }),
    },
  ),
);

function now() {
  return new Date().toISOString();
}
