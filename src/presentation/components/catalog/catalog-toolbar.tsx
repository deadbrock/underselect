'use client';

import { memo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import {
  CATALOG_SORT_LABELS,
  type CatalogSortOption,
} from '@shared/mocks/catalog.types';

import { CatalogFilterDrawer } from './catalog-filter-drawer';
import type { CatalogFilters } from '@shared/mocks/catalog.types';

export interface CatalogToolbarProps {
  total: number;
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  filters: CatalogFilters;
  onFiltersChange: (filters: CatalogFilters) => void;
  hideCategories?: boolean;
  activeFilterCount: number;
}

export const CatalogToolbar = memo(function CatalogToolbar({
  total,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  hideCategories,
  activeFilterCount,
}: CatalogToolbarProps) {
  return (
    <div className="border-border mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm">
        <span className="text-foreground font-medium tabular-nums">
          {total}
        </span>{' '}
        {total === 1 ? 'produto' : 'produtos'}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <CatalogFilterDrawer
          filters={filters}
          onChange={onFiltersChange}
          hideCategories={hideCategories}
          activeCount={activeFilterCount}
        />

        <div className="flex items-center gap-2">
          <label htmlFor="catalog-sort" className="text-label hidden sm:inline">
            Ordenar
          </label>
          <Select
            value={sort}
            onValueChange={(v) => onSortChange(v as CatalogSortOption)}
          >
            <SelectTrigger
              id="catalog-sort"
              className="w-[180px]"
              aria-label="Ordenar produtos"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CATALOG_SORT_LABELS) as CatalogSortOption[]).map(
                (key) => (
                  <SelectItem key={key} value={key}>
                    {CATALOG_SORT_LABELS[key]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
});
