'use client';

import { memo } from 'react';

import type { CatalogFilters } from '@shared/mocks/catalog.types';

import { CatalogFiltersPanel } from './catalog-filters-panel';

export interface CatalogFilterSidebarProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  hideCategories?: boolean;
}

export const CatalogFilterSidebar = memo(function CatalogFilterSidebar({
  filters,
  onChange,
  hideCategories,
}: CatalogFilterSidebarProps) {
  return (
    <aside
      className="hidden w-64 shrink-0 lg:block"
      aria-label="Filtros do catálogo"
    >
      <div className="sticky top-[calc(var(--header-height)+1rem)] max-h-[calc(100vh-var(--header-height)-2rem)] overflow-y-auto pr-2">
        <h2 className="text-label mb-6">Filtrar</h2>
        <CatalogFiltersPanel
          filters={filters}
          onChange={onChange}
          hideCategories={hideCategories}
        />
      </div>
    </aside>
  );
});
