'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MARKETING_PAGE_SIZE } from '@shared/constants/marketing-admin.constants';
import type {
  AdminInfluencer,
  InfluencerFilters,
  InfluencerSortOption,
} from '@shared/types/marketing-admin.types';
import {
  computeInfluencerMetrics,
  filterInfluencers,
  paginate,
  sortInfluencers,
} from '@presentation/stores/admin/marketing';
import type {
  AdminCampaign,
  AdminCoupon,
  CouponAttribution,
} from '@shared/types/marketing-admin.types';

const DEFAULT: InfluencerFilters = {
  search: '',
  status: 'all',
  channel: 'all',
};

export function useInfluencerListState(
  influencers: AdminInfluencer[],
  campaigns: AdminCampaign[],
  coupons: AdminCoupon[],
  attributions: CouponAttribution[],
) {
  const [filters, setFilters] = useState<InfluencerFilters>(DEFAULT);
  const [sort, setSort] = useState<InfluencerSortOption>('name-asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const metricsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeInfluencerMetrics>>();
    for (const inf of influencers) {
      map.set(
        inf.id,
        computeInfluencerMetrics(inf.id, campaigns, coupons, attributions, inf),
      );
    }
    return map;
  }, [influencers, campaigns, coupons, attributions]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters, sort, page]);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () =>
      sortInfluencers(
        filterInfluencers(influencers, filters),
        metricsMap,
        sort,
      ),
    [influencers, filters, sort, metricsMap],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / MARKETING_PAGE_SIZE),
  );
  const paginated = paginate(filtered, page);

  const updateFilter = useCallback(
    <K extends keyof InfluencerFilters>(
      key: K,
      value: InfluencerFilters[K],
    ) => {
      setFilters((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT), []);

  return {
    filters,
    sort,
    page,
    isLoading,
    paginated,
    metricsMap,
    totalPages,
    totalItems: filtered.length,
    setSort,
    setPage,
    updateFilter,
    resetFilters,
  };
}
