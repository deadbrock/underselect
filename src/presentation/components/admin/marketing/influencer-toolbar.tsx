'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { INFLUENCER_SORT_LABELS } from '@shared/constants/marketing-admin.constants';
import type { InfluencerSortOption } from '@shared/types/marketing-admin.types';

import {
  InfluencerFiltersPanel,
  type InfluencerFiltersPanelProps,
} from './influencer-filters';

export interface InfluencerToolbarProps extends InfluencerFiltersPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: InfluencerSortOption;
  onSortChange: (value: InfluencerSortOption) => void;
}

export const InfluencerToolbar = memo(function InfluencerToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  filters,
  onChange,
  onReset,
}: InfluencerToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Nome, usuário, código ou e-mail..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
            aria-label="Buscar influenciadores"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as InfluencerSortOption)}
        >
          <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Ordenar">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INFLUENCER_SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild className="min-h-10">
          <Link href="/admin/marketing/influenciadores/novo">Novo</Link>
        </Button>
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
              <InfluencerFiltersPanel
                filters={filters}
                onChange={onChange}
                onReset={onReset}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="border-border hidden rounded-md border p-4 lg:block">
        <InfluencerFiltersPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
        />
      </div>
    </div>
  );
});
