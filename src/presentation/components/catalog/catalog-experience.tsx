'use client';

import dynamic from 'next/dynamic';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useMemo, useState } from 'react';

import { Container } from '@presentation/components/layout';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import type {
  CatalogFilters,
  CatalogPageConfig,
  CatalogProduct,
  CatalogSortOption,
} from '@shared/mocks/catalog.types';
import { processCatalog } from '@shared/mocks/catalog.utils';

import { CatalogPageHeader } from './catalog-page-header';
import { CatalogToolbar } from './catalog-toolbar';
import { CatalogFilterSidebar } from './catalog-filter-sidebar';
import { CatalogProductGrid } from './catalog-product-grid';
import { CatalogPagination } from './catalog-pagination';
import { CatalogSearchBar } from './catalog-search-bar';
import {
  countActiveFilters,
  filtersToParams,
  getEmptyVariant,
  paramsToQueryString,
  EMPTY_FILTERS,
} from './catalog.helpers';
import { CatalogEmptyState } from './catalog-empty-state';

const QuickViewDialog = dynamic(
  () => import('./quick-view-dialog').then((m) => m.QuickViewDialog),
  { ssr: false },
);

export interface CatalogExperienceProps {
  products: CatalogProduct[];
  config: CatalogPageConfig;
  showSearch?: boolean;
  hideCategoryFilter?: boolean;
}

export const CatalogExperience = memo(function CatalogExperience({
  products,
  config,
  showSearch = false,
  hideCategoryFilter = false,
}: CatalogExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] =
    useState<CatalogProduct | null>(null);

  const urlParams = useMemo(() => {
    const p: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      p[k] = v;
    });
    return p;
  }, [searchParams]);

  const result = useMemo(
    () => processCatalog(products, urlParams, config.presetFilters),
    [products, urlParams, config.presetFilters],
  );

  const activeFilterCount = countActiveFilters(result.filters);

  const updateUrl = useCallback(
    (
      filters: CatalogFilters,
      sort: CatalogSortOption,
      page: number,
      query?: string,
    ) => {
      const params = filtersToParams(filters, sort, page, query);
      router.push(`${config.basePath}${paramsToQueryString(params)}` as Route, {
        scroll: false,
      });
    },
    [router, config.basePath],
  );

  const handleFiltersChange = useCallback(
    (filters: CatalogFilters) =>
      updateUrl(filters, result.sort, 1, result.query),
    [updateUrl, result.sort, result.query],
  );

  const handleSortChange = useCallback(
    (sort: CatalogSortOption) =>
      updateUrl(result.filters, sort, 1, result.query),
    [updateUrl, result.filters, result.query],
  );

  const handlePageChange = useCallback(
    (page: number) =>
      updateUrl(result.filters, result.sort, page, result.query),
    [updateUrl, result.filters, result.sort, result.query],
  );

  const handleSearchChange = useCallback(
    (q: string) => updateUrl(result.filters, result.sort, 1, q),
    [updateUrl, result.filters, result.sort],
  );

  const clearAll = useCallback(() => {
    updateUrl(
      { ...EMPTY_FILTERS, ...(config.presetFilters ?? {}) },
      'best-sellers',
      1,
      '',
    );
  }, [updateUrl, config.presetFilters]);

  const emptyVariant = getEmptyVariant(result.query, activeFilterCount);

  return (
    <Container className="py-8 md:py-12">
      <MotionReveal>
        <CatalogPageHeader
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
          breadcrumbs={config.breadcrumbs}
        />
      </MotionReveal>

      {showSearch && (
        <MotionReveal delay={0.05} className="mb-6">
          <CatalogSearchBar
            value={result.query}
            onChange={handleSearchChange}
          />
        </MotionReveal>
      )}

      <div className="flex gap-8 lg:gap-12">
        <CatalogFilterSidebar
          filters={result.filters}
          onChange={handleFiltersChange}
          hideCategories={hideCategoryFilter}
        />

        <div className="min-w-0 flex-1">
          <CatalogToolbar
            total={result.total}
            sort={result.sort}
            onSortChange={handleSortChange}
            filters={result.filters}
            onFiltersChange={handleFiltersChange}
            hideCategories={hideCategoryFilter}
            activeFilterCount={activeFilterCount}
          />

          {result.items.length === 0 ? (
            <CatalogEmptyState variant={emptyVariant} onAction={clearAll} />
          ) : (
            <>
              <CatalogProductGrid
                products={result.items}
                onQuickView={setQuickViewProduct}
                virtualized={result.total > 48}
              />
              <CatalogPagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      <QuickViewDialog
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </Container>
  );
});
