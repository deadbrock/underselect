'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
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
import { ORDER_SORT_LABELS } from '@shared/constants/order-admin.constants';
import type { OrderSortOption } from '@shared/types/order-admin.types';

import {
  OrderFiltersPanel,
  type OrderFiltersPanelProps,
} from './order-filters';

export interface OrderToolbarProps extends OrderFiltersPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: OrderSortOption;
  onSortChange: (value: OrderSortOption) => void;
}

export const OrderToolbar = memo(function OrderToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  filters,
  onChange,
  onReset,
}: OrderToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Pedido, cliente, CPF, e-mail..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
            aria-label="Buscar pedidos"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as OrderSortOption)}
        >
          <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Ordenar">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDER_SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <OrderFiltersPanel
                filters={filters}
                onChange={onChange}
                onReset={onReset}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="border-border hidden rounded-md border p-4 lg:block">
        <OrderFiltersPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
        />
      </div>
    </div>
  );
});
