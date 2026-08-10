'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MARKETING_PAGE_SIZE } from '@shared/constants/marketing-admin.constants';
import type {
  AdminCoupon,
  CouponAttribution,
  CouponFilters,
  CouponSortOption,
} from '@shared/types/marketing-admin.types';
import {
  filterCoupons,
  paginate,
  sortCoupons,
} from '@presentation/stores/admin/marketing';

const DEFAULT: CouponFilters = {
  search: '',
  status: 'all',
  discountType: 'all',
  influencerId: 'all',
  campaignId: 'all',
};

export function useCouponListState(
  coupons: AdminCoupon[],
  attributions: CouponAttribution[],
) {
  const [filters, setFilters] = useState<CouponFilters>(DEFAULT);
  const [sort, setSort] = useState<CouponSortOption>('code-asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters, sort, page]);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () => sortCoupons(filterCoupons(coupons, filters), sort, attributions),
    [coupons, filters, sort, attributions],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / MARKETING_PAGE_SIZE),
  );

  const updateFilter = useCallback(
    <K extends keyof CouponFilters>(key: K, value: CouponFilters[K]) => {
      setFilters((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  return {
    filters,
    sort,
    page,
    isLoading,
    paginated: paginate(filtered, page),
    totalPages,
    totalItems: filtered.length,
    setSort,
    setPage,
    updateFilter,
    resetFilters: () => setFilters(DEFAULT),
  };
}
