'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { ORDER_PAGE_SIZE } from '@shared/constants/order-admin.constants';
import type {
  AdminOrder,
  OrderFilters,
  OrderSortOption,
} from '@shared/types/order-admin.types';
import { filterOrders, sortOrders } from '@presentation/stores/admin/order';

const DEFAULT: OrderFilters = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  paymentStatus: 'all',
  shippingCarrier: 'all',
  coupon: '',
  influencer: '',
};

export function useOrderListState(orders: AdminOrder[]) {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT);
  const [sort, setSort] = useState<OrderSortOption>('date-desc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters, sort, page]);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () => sortOrders(filterOrders(orders, filters), sort),
    [orders, filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ORDER_PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * ORDER_PAGE_SIZE,
    page * ORDER_PAGE_SIZE,
  );

  const updateFilter = useCallback(
    <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
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
