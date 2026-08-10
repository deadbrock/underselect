'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MARKETING_PAGE_SIZE } from '@shared/constants/marketing-admin.constants';
import type {
  AdminCampaign,
  CampaignFilters,
  CampaignSortOption,
} from '@shared/types/marketing-admin.types';
import {
  filterCampaigns,
  paginate,
  sortCampaigns,
} from '@presentation/stores/admin/marketing';

const DEFAULT: CampaignFilters = {
  search: '',
  status: 'all',
  influencerId: 'all',
};

export function useCampaignListState(campaigns: AdminCampaign[]) {
  const [filters, setFilters] = useState<CampaignFilters>(DEFAULT);
  const [sort, setSort] = useState<CampaignSortOption>('name-asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters, sort, page]);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () => sortCampaigns(filterCampaigns(campaigns, filters), sort),
    [campaigns, filters, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / MARKETING_PAGE_SIZE),
  );

  const updateFilter = useCallback(
    <K extends keyof CampaignFilters>(key: K, value: CampaignFilters[K]) => {
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
