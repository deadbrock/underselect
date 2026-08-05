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
} from '@presentation/components/ui';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_PAYMENT_METHOD_LABELS,
  ADMIN_PAYMENT_STATUS_LABELS,
  ADMIN_SHIPPING_CARRIER_LABELS,
  ORDER_STATUS_FLOW,
} from '@shared/constants/order-admin.constants';
import type { OrderFilters } from '@shared/types/order-admin.types';
import { cn } from '@shared/utils/cn';

export interface OrderFiltersPanelProps {
  filters: OrderFilters;
  onChange: <K extends keyof OrderFilters>(
    key: K,
    value: OrderFilters[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export const OrderFiltersPanel = memo(function OrderFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: OrderFiltersPanelProps) {
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
          label="Status"
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...ORDER_STATUS_FLOW.map((s) => ({
              value: s,
              label: ADMIN_ORDER_STATUS_LABELS[s],
            })),
          ]}
        />
        <FilterSelect
          label="Pagamento"
          value={filters.paymentMethod}
          onChange={(v) => onChange('paymentMethod', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_PAYMENT_METHOD_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Status pagamento"
          value={filters.paymentStatus}
          onChange={(v) => onChange('paymentStatus', v)}
          options={[
            { value: 'all', label: 'Todos' },
            ...Object.entries(ADMIN_PAYMENT_STATUS_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <FilterSelect
          label="Entrega"
          value={filters.shippingCarrier}
          onChange={(v) => onChange('shippingCarrier', v)}
          options={[
            { value: 'all', label: 'Todas' },
            ...Object.entries(ADMIN_SHIPPING_CARRIER_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            })),
          ]}
        />
        <div className="space-y-2">
          <Label htmlFor="coupon">Cupom</Label>
          <Input
            id="coupon"
            value={filters.coupon}
            onChange={(e) => onChange('coupon', e.target.value)}
            placeholder="Código do cupom"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="influencer">Influenciador</Label>
          <Input
            id="influencer"
            value={filters.influencer}
            onChange={(e) => onChange('influencer', e.target.value)}
            placeholder="Código ou nome"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="date-from">Data inicial</Label>
          <Input
            id="date-from"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => onChange('dateFrom', e.target.value || undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-to">Data final</Label>
          <Input
            id="date-to"
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => onChange('dateTo', e.target.value || undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value-min">Valor mínimo</Label>
          <Input
            id="value-min"
            type="number"
            value={filters.valueMin ?? ''}
            onChange={(e) =>
              onChange(
                'valueMin',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value-max">Valor máximo</Label>
          <Input
            id="value-max"
            type="number"
            value={filters.valueMax ?? ''}
            onChange={(e) =>
              onChange(
                'valueMax',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
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
