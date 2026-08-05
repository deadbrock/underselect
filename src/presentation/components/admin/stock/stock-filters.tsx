'use client';

import { memo } from 'react';

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@presentation/components/ui';
import { CATALOG_BRANDS, CATALOG_TEAMS } from '@shared/mocks/catalog.constants';
import { ADMIN_PRODUCT_COLLECTIONS } from '@shared/constants/product-admin.constants';
import type { StockFilters } from '@shared/types/stock.types';
import { cn } from '@shared/utils/cn';

export interface StockFiltersPanelProps {
  filters: StockFilters;
  categories: string[];
  onChange: <K extends keyof StockFilters>(
    key: K,
    value: StockFilters[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export const StockFiltersPanel = memo(function StockFiltersPanel({
  filters,
  categories,
  onChange,
  onReset,
  className,
}: StockFiltersPanelProps) {
  return (
    <div className={cn('space-y-4', className)}>
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label="Categoria"
          value={filters.category}
          onChange={(v) => onChange('category', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <FilterSelect
          label="Coleção"
          value={filters.collection}
          onChange={(v) => onChange('collection', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...ADMIN_PRODUCT_COLLECTIONS.map((c) => ({ value: c, label: c })),
          ]}
        />
        <FilterSelect
          label="Time"
          value={filters.team}
          onChange={(v) => onChange('team', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...CATALOG_TEAMS.map((t) => ({ value: t, label: t })),
          ]}
        />
        <FilterSelect
          label="Marca"
          value={filters.brand}
          onChange={(v) => onChange('brand', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...CATALOG_BRANDS.map((b) => ({ value: b, label: b })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'ok', label: 'Normal' },
            { value: 'low', label: 'Estoque baixo' },
            { value: 'out', label: 'Sem estoque' },
            { value: 'excess', label: 'Excesso' },
          ]}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="qty-min">Qtd. mínima</Label>
          <Input
            id="qty-min"
            type="number"
            value={filters.qtyMin ?? ''}
            onChange={(e) =>
              onChange(
                'qtyMin',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qty-max">Qtd. máxima</Label>
          <Input
            id="qty-max"
            type="number"
            value={filters.qtyMax ?? ''}
            onChange={(e) =>
              onChange(
                'qtyMax',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Toggle
          id="low"
          label="Estoque baixo"
          checked={filters.lowStock}
          onChange={(v) => onChange('lowStock', v)}
        />
        <Toggle
          id="out"
          label="Sem estoque"
          checked={filters.outOfStock}
          onChange={(v) => onChange('outOfStock', v)}
        />
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
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
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

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
