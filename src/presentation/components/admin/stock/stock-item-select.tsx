'use client';

import { memo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { FormField } from '@presentation/components/forms';
import type { StockItem } from '@shared/types/stock.types';

function itemLabel(item: StockItem) {
  const variation = [item.size, item.color].filter(Boolean).join(' · ');
  return variation
    ? `${item.productName} — ${item.sku} (${variation})`
    : `${item.productName} — ${item.sku}`;
}

export interface StockItemSelectProps {
  items: StockItem[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  label?: string;
}

export const StockItemSelect = memo(function StockItemSelect({
  items,
  value,
  onChange,
  name = 'stockItemId',
  label = 'Produto / Variação',
}: StockItemSelectProps) {
  return (
    <FormField
      name={name}
      label={label}
      render={() => (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-10" aria-label={label}>
            <SelectValue placeholder="Selecione o item" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {itemLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
});

export function stockItemSelectField(
  items: StockItem[],
  field: { value: string; onChange: (v: string) => void },
) {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger className="h-10" aria-label="Produto / Variação">
        <SelectValue placeholder="Selecione o item" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {itemLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
