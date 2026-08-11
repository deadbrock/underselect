'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { STOCK_PAGE_SIZE } from '@shared/constants/stock.constants';
import type {
  StockFilters,
  StockItem,
  StockSortOption,
} from '@shared/types/stock.types';
import {
  filterStockItems,
  sortStockItems,
} from '@presentation/stores/admin/stock';

const DEFAULT: StockFilters = {
  search: '',
  category: 'all',
  collection: 'all',
  team: 'all',
  brand: 'all',
  status: 'all',
  lowStock: false,
  outOfStock: false,
};

export function useStockListState(items: StockItem[]) {
  const [filters, setFilters] = useState<StockFilters>(DEFAULT);
  const [sort, setSort] = useState<StockSortOption>('updated-desc');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () => sortStockItems(filterStockItems(items, filters), sort),
    [items, filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / STOCK_PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * STOCK_PAGE_SIZE,
    page * STOCK_PAGE_SIZE,
  );

  const updateFilter = useCallback(
    <K extends keyof StockFilters>(key: K, value: StockFilters[K]) => {
      setFilters((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT), []);

  return {
    filters,
    sort,
    page,
    filtered,
    paginated,
    totalPages,
    totalItems: filtered.length,
    setSort,
    setPage,
    updateFilter,
    resetFilters,
  };
}
