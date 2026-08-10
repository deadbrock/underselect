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
import {
  ADMIN_CUSTOMER_SEGMENT_LABELS,
  ADMIN_CUSTOMER_STATUS_LABELS,
  ADMIN_CUSTOMER_TYPE_LABELS,
} from '@shared/constants/customer-admin.constants';
import type { CustomerFilters } from '@shared/types/customer-admin.types';
import { cn } from '@shared/utils/cn';

export interface CustomerFiltersPanelProps {
  filters: CustomerFilters;
  onChange: <K extends keyof CustomerFilters>(
    key: K,
    value: CustomerFilters[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export const CustomerFiltersPanel = memo(function CustomerFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: CustomerFiltersPanelProps) {
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
          label="Tipo"
          value={filters.type}
          onChange={(v) => onChange('type', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_CUSTOMER_TYPE_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_CUSTOMER_STATUS_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Segmento"
          value={filters.segment}
          onChange={(v) => onChange('segment', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_CUSTOMER_SEGMENT_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DateField
          id="reg-from"
          label="Cadastro de"
          value={filters.registeredFrom}
          onChange={(v) => onChange('registeredFrom', v)}
        />
        <DateField
          id="reg-to"
          label="Cadastro até"
          value={filters.registeredTo}
          onChange={(v) => onChange('registeredTo', v)}
        />
        <DateField
          id="last-from"
          label="Última compra de"
          value={filters.lastPurchaseFrom}
          onChange={(v) => onChange('lastPurchaseFrom', v)}
        />
        <DateField
          id="last-to"
          label="Última compra até"
          value={filters.lastPurchaseTo}
          onChange={(v) => onChange('lastPurchaseTo', v)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField
          id="spent-min"
          label="Valor mín. comprado"
          value={filters.spentMin}
          onChange={(v) => onChange('spentMin', v)}
        />
        <NumberField
          id="spent-max"
          label="Valor máx. comprado"
          value={filters.spentMax}
          onChange={(v) => onChange('spentMax', v)}
        />
        <NumberField
          id="orders-min"
          label="Pedidos mín."
          value={filters.ordersMin}
          onChange={(v) => onChange('ordersMin', v)}
        />
        <NumberField
          id="orders-max"
          label="Pedidos máx."
          value={filters.ordersMax}
          onChange={(v) => onChange('ordersMax', v)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Toggle
          id="with-orders"
          label="Com pedidos"
          checked={filters.withOrders}
          onChange={(v) => onChange('withOrders', v)}
        />
        <Toggle
          id="without-orders"
          label="Sem pedidos"
          checked={filters.withoutOrders}
          onChange={(v) => onChange('withoutOrders', v)}
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

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
      />
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
