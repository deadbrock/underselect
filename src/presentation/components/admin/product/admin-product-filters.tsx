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
import { useClassificationOptions } from '@presentation/hooks/use-classification-options';
import { CATALOG_BRANDS } from '@shared/constants/catalog.constants';
import type { AdminProductFilters } from '@shared/types/product-admin.types';
import { cn } from '@shared/utils/cn';

export interface AdminProductFiltersPanelProps {
  filters: AdminProductFilters;
  onChange: <K extends keyof AdminProductFilters>(
    key: K,
    value: AdminProductFilters[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export const AdminProductFiltersPanel = memo(function AdminProductFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: AdminProductFiltersPanelProps) {
  const { categories, collections, teams, selections } =
    useClassificationOptions();

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filtros avançados</span>
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
            ...categories.map((c) => ({
              value: c.slug,
              label: c.label,
            })),
          ]}
        />
        <FilterSelect
          label="Coleção"
          value={filters.collection}
          onChange={(v) => onChange('collection', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...collections.map((c) => ({ value: c, label: c })),
          ]}
        />
        <FilterSelect
          label="Time"
          value={filters.team}
          onChange={(v) => onChange('team', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...teams.map((t) => ({ value: t, label: t })),
          ]}
        />
        <FilterSelect
          label="Seleção"
          value={filters.selection}
          onChange={(v) => onChange('selection', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...selections.map((s) => ({ value: s, label: s })),
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
            { value: 'active', label: 'Ativo' },
            { value: 'inactive', label: 'Inativo' },
            { value: 'draft', label: 'Rascunho' },
            { value: 'archived', label: 'Arquivado' },
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price-min">Preço mínimo</Label>
          <Input
            id="price-min"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              onChange(
                'priceMin',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-max">Preço máximo</Label>
          <Input
            id="price-max"
            type="number"
            inputMode="numeric"
            placeholder="999"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              onChange(
                'priceMax',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ToggleRow
          id="filter-promo"
          label="Em promoção"
          checked={filters.onSale === true}
          onChange={(v) => onChange('onSale', v ? true : undefined)}
        />
        <ToggleRow
          id="filter-new"
          label="Novidade"
          checked={filters.isNew === true}
          onChange={(v) => onChange('isNew', v ? true : undefined)}
        />
        <ToggleRow
          id="filter-stock"
          label="Somente disponíveis"
          checked={filters.inStock === true}
          onChange={(v) => onChange('inStock', v ? true : undefined)}
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
  onChange: (value: string) => void;
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

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
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
