'use client';

import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import { useProductStore } from '@presentation/stores/admin/product';
import { useStockStore } from '@presentation/stores/admin/stock';
import {
  generateAlerts,
  getUniqueCategories,
} from '@presentation/stores/admin/stock/stock.utils';
import type { StockItem } from '@shared/types/stock.types';

import { StockAlertsBanner } from './stock-alerts-banner';
import { StockCards } from './stock-cards';
import { StockTable } from './stock-table';
import { StockToolbar } from './stock-toolbar';
import { useStockListState } from './use-stock-list-state';

export const StockList = memo(function StockList() {
  const stockItems = useStockStore((s) => s.stockItems);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const patchProductStock = useProductStore((s) => s.patchProductStock);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const isHydrated = useProductStore((s) => s.isHydrated);
  const storeLoading = useProductStore((s) => s.isLoading);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => getUniqueCategories(stockItems),
    [stockItems],
  );

  const {
    filters,
    sort,
    page,
    paginated,
    totalPages,
    totalItems,
    setSort,
    setPage,
    updateFilter,
    resetFilters,
  } = useStockListState(stockItems);

  const isLoading = !isHydrated || storeLoading;

  const alerts = useMemo(
    () => generateAlerts(stockItems).slice(0, 3),
    [stockItems],
  );

  const handleSaveStock = useCallback(
    async (item: StockItem, values: { stock: number; minStock: number }) => {
      setSavingItemId(item.id);
      try {
        await patchProductStock(item.productId, {
          variationId: item.variationId,
          stock: values.stock,
          minStock: values.minStock,
        });
        toast.success('Estoque atualizado.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao salvar estoque.',
        );
      } finally {
        setSavingItemId(null);
      }
    },
    [patchProductStock],
  );

  const handleDeleteProduct = useCallback(
    async (item: StockItem) => {
      if (
        !window.confirm(
          `Excluir o produto "${item.productName}"? Esta ação não pode ser desfeita.`,
        )
      ) {
        return;
      }

      setDeletingProductId(item.productId);
      try {
        await deleteProduct(item.productId);
        toast.success('Produto excluído.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao excluir produto.',
        );
      } finally {
        setDeletingProductId(null);
      }
    },
    [deleteProduct],
  );

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
          description="Ajuste os filtros ou cadastre produtos no catálogo."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <StockTable
                  items={paginated}
                  onSaveStock={handleSaveStock}
                  onDeleteProduct={handleDeleteProduct}
                  savingItemId={savingItemId}
                  deletingProductId={deletingProductId}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <StockCards
              items={paginated}
              onSaveStock={handleSaveStock}
              onDeleteProduct={handleDeleteProduct}
              savingItemId={savingItemId}
              deletingProductId={deletingProductId}
            />
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
