'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { ADMIN_PRODUCT_PAGE_SIZE } from '@shared/constants/product-admin.constants';
import type {
  AdminProduct,
  AdminProductFilters,
  AdminProductSortOption,
  AdminProductViewMode,
} from '@shared/types/product-admin.types';
import {
  filterProducts,
  sortProducts,
} from '@presentation/stores/admin/product';

const DEFAULT_FILTERS: AdminProductFilters = {
  search: '',
  category: 'all',
  collection: 'all',
  team: 'all',
  selection: 'all',
  brand: 'all',
  status: 'all',
};

export function useProductListState(products: AdminProduct[]) {
  const [filters, setFilters] = useState<AdminProductFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<AdminProductSortOption>('newest');
  const [viewMode, setViewMode] = useState<AdminProductViewMode>('list');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filters, sort, page, viewMode]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const filtered = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    [products, filters, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ADMIN_PRODUCT_PAGE_SIZE),
  );

  const paginated = useMemo(
    () =>
      filtered.slice(
        (page - 1) * ADMIN_PRODUCT_PAGE_SIZE,
        page * ADMIN_PRODUCT_PAGE_SIZE,
      ),
    [filtered, page],
  );

  const updateFilter = useCallback(
    <K extends keyof AdminProductFilters>(
      key: K,
      value: AdminProductFilters[K],
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    filters,
    sort,
    viewMode,
    page,
    isLoading,
    filtered,
    paginated,
    totalPages,
    totalItems: filtered.length,
    setSort,
    setViewMode,
    setPage,
    updateFilter,
    resetFilters,
  };
}
