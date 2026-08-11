'use client';

import { SlidersHorizontal } from 'lucide-react';
import { memo } from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@presentation/components/ui';
import type { CatalogFilters } from '@shared/types/catalog.types';

import { CatalogFiltersPanel } from './catalog-filters-panel';

export interface CatalogFilterDrawerProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  hideCategories?: boolean;
  activeCount: number;
}

export const CatalogFilterDrawer = memo(function CatalogFilterDrawer({
  filters,
  onChange,
  hideCategories,
  activeCount,
}: CatalogFilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="bg-foreground text-background flex size-5 items-center justify-center text-[0.625rem]">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-luxury">Filtrar produtos</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-6 pb-8">
          <CatalogFiltersPanel
            filters={filters}
            onChange={onChange}
            hideCategories={hideCategories}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
});
