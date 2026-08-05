'use client';

import Link from 'next/link';
import { memo, useEffect, useMemo } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useStockStore } from '@presentation/stores/admin/stock';
import {
  generateAlerts,
  getUniqueCategories,
} from '@presentation/stores/admin/stock/stock.utils';

import { StockAlertsBanner } from './stock-alerts-banner';
import { StockCards } from './stock-cards';
import { StockTable } from './stock-table';
import { StockToolbar } from './stock-toolbar';
import { useStockListState } from './use-stock-list-state';

export const StockList = memo(function StockList() {
  const stockItems = useStockStore((s) => s.stockItems);
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);

  const categories = useMemo(
    () => getUniqueCategories(stockItems),
    [stockItems],
  );

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
  } = useStockListState(stockItems);

  const alerts = useMemo(
    () => generateAlerts(stockItems).slice(0, 3),
    [stockItems],
  );

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos em Estoque"
        description="Visão detalhada por produto e variação — quantidades, status e alertas."
        actions={
          <Link
            href="/admin/estoque/entradas"
            className="text-label text-brand-bronze hover:underline"
          >
            Nova entrada
          </Link>
        }
      />

      {alerts.length > 0 && <StockAlertsBanner alerts={alerts} />}

      <StockToolbar
        search={filters.search}
        onSearchChange={(v) => updateFilter('search', v)}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner className="size-8" />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="Nenhum item encontrado"
          description="Ajuste os filtros ou registre uma entrada de estoque."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <StockTable items={paginated} />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <StockCards items={paginated} />
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
