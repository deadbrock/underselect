'use client';

import {
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import { memo } from 'react';

import { Button, Input } from '@presentation/components/ui';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { ADMIN_PRODUCT_SORT_LABELS } from '@shared/constants/product-admin.constants';
import type {
  AdminProductSortOption,
  AdminProductViewMode,
} from '@shared/types/product-admin.types';

import { AdminProductFiltersPanel } from './admin-product-filters';
import type { AdminProductFiltersPanelProps } from './admin-product-filters';

export interface AdminProductToolbarProps extends AdminProductFiltersPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: AdminProductSortOption;
  onSortChange: (value: AdminProductSortOption) => void;
  viewMode: AdminProductViewMode;
  onViewModeChange: (mode: AdminProductViewMode) => void;
  onNew: () => void;
  onImport: () => void;
}

export const AdminProductToolbar = memo(function AdminProductToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNew,
  onImport,
  filters,
  onChange,
  onReset,
}: AdminProductToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Buscar por nome ou SKU..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-9"
              aria-label="Buscar produtos"
            />
          </div>
          <Select
            value={sort}
            onValueChange={(v) => onSortChange(v as AdminProductSortOption)}
          >
            <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Ordenar">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ADMIN_PRODUCT_SORT_LABELS).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <div className="hidden items-center gap-1 md:flex">
            <Button
              type="button"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="size-10"
              aria-label="Visualização em lista"
              onClick={() => onViewModeChange('list')}
            >
              <List className="size-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="size-10"
              aria-label="Visualização em grid"
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Drawer direction="bottom">
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-10 lg:hidden"
              >
                <SlidersHorizontal className="mr-2 size-4" />
                Filtros
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle>Filtros</DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto px-4 pb-8">
                <AdminProductFiltersPanel
                  filters={filters}
                  onChange={onChange}
                  onReset={onReset}
                />
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            type="button"
            variant="outline"
            className="min-h-10"
            onClick={onImport}
          >
            <Upload className="mr-2 size-4" />
            Importar
          </Button>
          <Button type="button" className="min-h-10" onClick={onNew}>
            <Plus className="mr-2 size-4" />
            Novo produto
          </Button>
        </div>
      </div>

      <div className="border-border hidden rounded-md border p-4 lg:block">
        <AdminProductFiltersPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
        />
      </div>
    </div>
  );
});
