'use client';

import { memo, useEffect } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useOrderStore } from '@presentation/stores/admin/order';

import { OrderCards } from './order-cards';
import { OrderTable } from './order-table';
import { OrderToolbar } from './order-toolbar';
import { useOrderListState } from './use-order-list-state';

export const OrderList = memo(function OrderList() {
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
  } = useOrderListState(orders);

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todos os Pedidos"
        description="Gerencie o ciclo de vida completo — filtros avançados e ações rápidas."
      />

      <OrderToolbar
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
          title="Nenhum pedido encontrado"
          description="Ajuste os filtros ou aguarde novos pedidos."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <OrderTable orders={paginated} />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <OrderCards orders={paginated} />
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
