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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import {
  ADMIN_CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_SORT_LABELS,
} from '@shared/constants/marketing-admin.constants';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import type {
  CampaignFilters,
  CampaignSortOption,
} from '@shared/types/marketing-admin.types';

interface CampaignToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: CampaignSortOption;
  onSortChange: (v: CampaignSortOption) => void;
  filters: CampaignFilters;
  onChange: <K extends keyof CampaignFilters>(
    key: K,
    value: CampaignFilters[K],
  ) => void;
  onReset: () => void;
}

export const CampaignToolbar = memo(function CampaignToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  filters,
  onChange,
  onReset,
}: CampaignToolbarProps) {
  const influencers = useMarketingStore((s) => s.influencers);

  const panel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filtros</span>
        <button
          type="button"
          className="text-label text-brand-bronze text-xs hover:underline"
          onClick={onReset}
        >
          Limpar
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => onChange('status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(ADMIN_CAMPAIGN_STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Influenciador</Label>
          <Select
            value={filters.influencerId}
            onValueChange={(v) => onChange('influencerId', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {influencers.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

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
            placeholder="Buscar campanhas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
            aria-label="Buscar campanhas"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as CampaignSortOption)}
        >
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CAMPAIGN_SORT_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild className="min-h-10">
          <Link href="/admin/marketing/campanhas/novo">Nova</Link>
        </Button>
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <Button variant="outline" className="min-h-10 lg:hidden">
              <SlidersHorizontal className="mr-2 size-4" />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>Filtros</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">{panel}</div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="border-border hidden rounded-md border p-4 lg:block">
        {panel}
      </div>
    </div>
  );
});
