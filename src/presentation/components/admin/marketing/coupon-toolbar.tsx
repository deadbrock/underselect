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
  ADMIN_COUPON_STATUS_LABELS,
  ADMIN_COUPON_TYPE_LABELS,
  COUPON_SORT_LABELS,
} from '@shared/constants/marketing-admin.constants';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import type {
  CouponFilters,
  CouponSortOption,
} from '@shared/types/marketing-admin.types';

interface CouponToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: CouponSortOption;
  onSortChange: (v: CouponSortOption) => void;
  filters: CouponFilters;
  onChange: <K extends keyof CouponFilters>(
    key: K,
    value: CouponFilters[K],
  ) => void;
  onReset: () => void;
}

export const CouponToolbar = memo(function CouponToolbar(
  props: CouponToolbarProps,
) {
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);

  const panel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filtros</span>
        <button
          type="button"
          className="text-label text-brand-bronze text-xs hover:underline"
          onClick={props.onReset}
        >
          Limpar
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label="Status"
          value={props.filters.status}
          onChange={(v) => props.onChange('status', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_COUPON_STATUS_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Tipo"
          value={props.filters.discountType}
          onChange={(v) => props.onChange('discountType', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_COUPON_TYPE_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Influenciador"
          value={props.filters.influencerId}
          onChange={(v) => props.onChange('influencerId', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...influencers.map((i) => ({ value: i.id, label: i.name })),
          ]}
        />
        <FilterSelect
          label="Campanha"
          value={props.filters.campaignId}
          onChange={(v) => props.onChange('campaignId', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...campaigns.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
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
            placeholder="Código ou nome..."
            value={props.search}
            onChange={(e) => props.onSearchChange(e.target.value)}
            className="h-10 pl-9"
            aria-label="Buscar cupons"
          />
        </div>
        <Select
          value={props.sort}
          onValueChange={(v) => props.onSortChange(v as CouponSortOption)}
        >
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COUPON_SORT_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild className="min-h-10">
          <Link href="/admin/marketing/cupons/novo">Novo cupom</Link>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
