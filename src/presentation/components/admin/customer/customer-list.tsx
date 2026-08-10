'use client';

import { memo, useEffect } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useCustomerStore } from '@presentation/stores/admin/customer';
import { useOrderStore } from '@presentation/stores/admin/order';

import { CustomerCards } from './customer-cards';
import { CustomerTable } from './customer-table';
import { CustomerToolbar } from './customer-toolbar';
import { useCustomerListState } from './use-customer-list-state';

export const CustomerList = memo(function CustomerList() {
  const customers = useCustomerStore((s) => s.customers);
  const orders = useOrderStore((s) => s.orders);
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);

  const {
    filters,
    sort,
    page,
    isLoading,
    paginated,
    totalPages,
    totalItems,
    setSort,
    setPage,
    updateFilter,
    resetFilters,
  } = useCustomerListState(customers, orders);

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todos os Clientes"
        description="CRM UNDER SELECT — busca, filtros e análise comercial."
      />

      <CustomerToolbar
        search={filters.search}
        onSearchChange={(v) => updateFilter('search', v)}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner className="size-8" />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Ajuste os filtros ou aguarde novos cadastros."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <CustomerTable customers={paginated} />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <CustomerCards customers={paginated} />
          </div>
          <AdminModulePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
});
