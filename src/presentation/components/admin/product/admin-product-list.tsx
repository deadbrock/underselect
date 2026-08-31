'use client';

import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EmptyState } from '@presentation/components/feedback';
import { Spinner } from '@presentation/components/feedback';
import { Badge, Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { useProductStore } from '@presentation/stores/admin/product';
import { ADMIN_PRODUCT_STATUS_LABELS } from '@shared/constants/product-admin.constants';
import { formatCurrency, formatDate } from '@shared/utils/format';
import { shouldUnoptimizeImage } from '@shared/utils/media-src';

import { AdminProductGridView } from './admin-product-grid-view';
import { AdminProductImportDialog } from './admin-product-import-dialog';
import { AdminProductTable } from './admin-product-table';
import { AdminProductToolbar } from './admin-product-toolbar';
import { useProductListState } from './use-product-list-state';

export const AdminProductList = memo(function AdminProductList() {
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const isHydrated = useProductStore((s) => s.isHydrated);
  const storeLoading = useProductStore((s) => s.isLoading);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const {
    filters,
    sort,
    viewMode,
    page,
    paginated,
    totalPages,
    totalItems,
    setSort,
    setViewMode,
    setPage,
    updateFilter,
    resetFilters,
  } = useProductListState(products);

  const isLoading = !isHydrated || storeLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos"
        description="Gerencie todo o catálogo UNDER SELECT — produtos, variações, galeria e SEO."
      />

      <AdminProductToolbar
        search={filters.search}
        onSearchChange={(v) => updateFilter('search', v)}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNew={() => router.push('/admin/produtos/novo')}
        onImport={() => setImportOpen(true)}
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
          title="Nenhum produto encontrado"
          description="Ajuste os filtros ou cadastre um novo produto."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            {viewMode === 'list' ? (
              <Card className="shadow-none">
                <CardContent className="p-0">
                  <AdminProductTable products={paginated} />
                </CardContent>
              </Card>
            ) : (
              <AdminProductGridView products={paginated} />
            )}
          </div>

          <ul className="space-y-3 md:hidden" aria-label="Produtos">
            {paginated.map((product) => (
              <li key={product.id}>
                <Card className="shadow-none">
                  <CardContent className="flex gap-3 p-4">
                    <div className="bg-muted relative size-20 shrink-0 overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt ?? product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={shouldUnoptimizeImage(product.imageUrl)}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {product.sku}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">
                          {ADMIN_PRODUCT_STATUS_LABELS[product.status]}
                        </Badge>
                        <span className="tabular-nums">
                          {formatCurrency(product.price)}
                        </span>
                        <span>Estoque {product.stockQuantity}</span>
                      </div>
                      <time
                        className="text-muted-foreground text-xs"
                        dateTime={product.createdAt}
                      >
                        {formatDate(product.createdAt)}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <AdminModulePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}

      <AdminProductImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
});
