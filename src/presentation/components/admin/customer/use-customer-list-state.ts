'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { CUSTOMER_PAGE_SIZE } from '@shared/constants/customer-admin.constants';
import type {
  AdminCustomer,
  CustomerFilters,
  CustomerSortOption,
} from '@shared/types/customer-admin.types';
import {
  filterCustomers,
  getOrderNumbersByCustomer,
  sortCustomers,
} from '@presentation/stores/admin/customer';
import type { AdminOrder } from '@shared/types/order-admin.types';

const DEFAULT: CustomerFilters = {
  search: '',
  type: 'all',
  status: 'all',
  segment: 'all',
  withOrders: false,
  withoutOrders: false,
};

export function useCustomerListState(
  customers: AdminCustomer[],
  orders: AdminOrder[] = [],
) {
  const [filters, setFilters] = useState<CustomerFilters>(DEFAULT);
  const [sort, setSort] = useState<CustomerSortOption>('name-asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const orderMap = useMemo(() => getOrderNumbersByCustomer(orders), [orders]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters, sort, page]);

  useEffect(() => setPage(1), [filters, sort]);

  const filtered = useMemo(
    () => sortCustomers(filterCustomers(customers, filters, orderMap), sort),
    [customers, filters, sort, orderMap],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / CUSTOMER_PAGE_SIZE),
  );
  const paginated = filtered.slice(
    (page - 1) * CUSTOMER_PAGE_SIZE,
    page * CUSTOMER_PAGE_SIZE,
  );

  const updateFilter = useCallback(
    <K extends keyof CustomerFilters>(key: K, value: CustomerFilters[K]) => {
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
