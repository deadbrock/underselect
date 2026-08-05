'use client';

import { memo } from 'react';

import { Checkbox, Label, Separator } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';
import type { CatalogFilters } from '@shared/mocks/catalog.types';
import {
  CATALOG_BRANDS,
  CATALOG_CATEGORIES,
  CATALOG_PRICE_RANGE,
  CATALOG_SEASONS,
  CATALOG_SELECTIONS,
  CATALOG_SIZES,
  CATALOG_TEAMS,
  CATALOG_TYPES,
} from '@shared/mocks/catalog.constants';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = memo(function FilterSection({
  title,
  children,
}: FilterSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-label text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
});

interface CheckboxFilterProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  idPrefix: string;
}

const CheckboxFilter = memo(function CheckboxFilter({
  options,
  selected,
  onChange,
  idPrefix,
}: CheckboxFilterProps) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <ul className="max-h-40 space-y-2 overflow-y-auto pr-1">
      {options.map((opt) => (
        <li key={opt.value} className="flex items-center gap-2">
          <Checkbox
            id={`${idPrefix}-${opt.value}`}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          />
          <Label
            htmlFor={`${idPrefix}-${opt.value}`}
            className="cursor-pointer font-normal tracking-normal normal-case"
          >
            {opt.label}
          </Label>
        </li>
      ))}
    </ul>
  );
});

export interface CatalogFiltersPanelProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  hideCategories?: boolean;
  className?: string;
}

export const CatalogFiltersPanel = memo(function CatalogFiltersPanel({
  filters,
  onChange,
  hideCategories = false,
  className,
}: CatalogFiltersPanelProps) {
  const update = (partial: Partial<CatalogFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className={cn('space-y-6', className)}>
      {!hideCategories && (
        <FilterSection title="Categoria">
          <CheckboxFilter
            idPrefix="cat"
            options={CATALOG_CATEGORIES.map((c) => ({
              value: c.slug,
              label: c.label,
            }))}
            selected={filters.categories}
            onChange={(categories) => update({ categories })}
          />
        </FilterSection>
      )}

      <FilterSection title="Tipo">
        <CheckboxFilter
          idPrefix="type"
          options={CATALOG_TYPES.map((t) => ({
            value: t.value,
            label: t.label,
          }))}
          selected={filters.types}
          onChange={(types) => update({ types })}
        />
      </FilterSection>

      <Separator />

      <FilterSection title="Time">
        <CheckboxFilter
          idPrefix="team"
          options={CATALOG_TEAMS.map((t) => ({ value: t, label: t }))}
          selected={filters.teams}
          onChange={(teams) => update({ teams })}
        />
      </FilterSection>

      <FilterSection title="Seleção">
        <CheckboxFilter
          idPrefix="sel"
          options={CATALOG_SELECTIONS.map((s) => ({ value: s, label: s }))}
          selected={filters.selections}
          onChange={(selections) => update({ selections })}
        />
      </FilterSection>

      <Separator />

      <FilterSection title="Marca">
        <CheckboxFilter
          idPrefix="brand"
          options={CATALOG_BRANDS.map((b) => ({ value: b, label: b }))}
          selected={filters.brands}
          onChange={(brands) => update({ brands })}
        />
      </FilterSection>

      <FilterSection title="Temporada">
        <CheckboxFilter
          idPrefix="season"
          options={CATALOG_SEASONS.map((s) => ({ value: s, label: s }))}
          selected={filters.seasons}
          onChange={(seasons) => update({ seasons })}
        />
      </FilterSection>

      <FilterSection title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {CATALOG_SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  update({
                    sizes: active
                      ? filters.sizes.filter((s) => s !== size)
                      : [...filters.sizes, size],
                  })
                }
                className={cn(
                  'border-input flex size-10 items-center justify-center border text-xs transition-colors',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'hover:border-foreground',
                )}
                aria-pressed={active}
                aria-label={`Tamanho ${size}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Faixa de preço">
        <div className="flex gap-2">
          <input
            type="number"
            min={CATALOG_PRICE_RANGE.min}
            max={CATALOG_PRICE_RANGE.max}
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              update({
                priceMin: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="border-input h-10 w-full border px-3 text-sm"
            aria-label="Preço mínimo"
          />
          <input
            type="number"
            min={CATALOG_PRICE_RANGE.min}
            max={CATALOG_PRICE_RANGE.max}
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              update({
                priceMax: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="border-input h-10 w-full border px-3 text-sm"
            aria-label="Preço máximo"
          />
        </div>
      </FilterSection>

      <FilterSection title="Disponibilidade">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Checkbox
              id="filter-sale"
              checked={filters.onSale === true}
              onCheckedChange={(c) =>
                update({ onSale: c === true ? true : undefined })
              }
            />
            <Label
              htmlFor="filter-sale"
              className="font-normal tracking-normal normal-case"
            >
              Em promoção
            </Label>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox
              id="filter-stock"
              checked={filters.inStock === true}
              onCheckedChange={(c) =>
                update({ inStock: c === true ? true : undefined })
              }
            />
            <Label
              htmlFor="filter-stock"
              className="font-normal tracking-normal normal-case"
            >
              Disponível
            </Label>
          </li>
        </ul>
      </FilterSection>
    </div>
  );
});
