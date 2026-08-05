'use client';

import { memo, useMemo, useState } from 'react';

import { EmptyState } from '@presentation/components/feedback';
import { DataTable, type Column } from '@presentation/components/data-display';
import {
  Badge,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useStockStore } from '@presentation/stores/admin/stock';
import { STOCK_MOVEMENT_LABELS } from '@shared/constants/stock.constants';
import type {
  StockMovement,
  StockMovementType,
} from '@shared/types/stock.types';
import { formatDateTime } from '@shared/utils/format';

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  ...Object.entries(STOCK_MOVEMENT_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const columns: Column<StockMovement>[] = [
  {
    key: 'type',
    header: 'Tipo',
    cell: (m) => (
      <Badge variant="secondary">{STOCK_MOVEMENT_LABELS[m.type]}</Badge>
    ),
  },
  {
    key: 'product',
    header: 'Produto',
    cell: (m) => (
      <div className="min-w-[140px]">
        <p className="font-medium">{m.productName}</p>
        <p className="text-muted-foreground font-mono text-xs">{m.sku}</p>
        {m.variationLabel && (
          <p className="text-muted-foreground text-xs">{m.variationLabel}</p>
        )}
      </div>
    ),
  },
  {
    key: 'quantity',
    header: 'Qtd.',
    cell: (m) => <span className="tabular-nums">{m.quantity}</span>,
  },
  {
    key: 'previousBalance',
    header: 'Saldo anterior',
    cell: (m) => <span className="tabular-nums">{m.previousBalance}</span>,
    hideOnMobile: true,
  },
  {
    key: 'currentBalance',
    header: 'Saldo atual',
    cell: (m) => <span className="tabular-nums">{m.currentBalance}</span>,
    hideOnMobile: true,
  },
  {
    key: 'reason',
    header: 'Motivo',
    cell: (m) => m.reason,
    hideOnMobile: true,
  },
  {
    key: 'notes',
    header: 'Observação',
    cell: (m) => m.notes ?? '—',
    hideOnMobile: true,
  },
  {
    key: 'user',
    header: 'Usuário',
    cell: (m) => m.user,
    hideOnMobile: true,
  },
  {
    key: 'createdAt',
    header: 'Data',
    cell: (m) => formatDateTime(m.createdAt),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (m) => (
      <Badge variant={m.status === 'completed' ? 'secondary' : 'outline'}>
        {m.status === 'completed' ? 'Concluída' : m.status}
      </Badge>
    ),
    hideOnMobile: true,
  },
];

export const StockMovementsList = memo(function StockMovementsList() {
  const movements = useStockStore((s) => s.movements);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = movements;
    if (typeFilter !== 'all') {
      result = result.filter(
        (m) => m.type === (typeFilter as StockMovementType),
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.productName.toLowerCase().includes(q) ||
          m.sku.toLowerCase().includes(q),
      );
    }
    return result;
  }, [movements, typeFilter, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Movimentações"
        description="Histórico completo com rastreabilidade — entradas, saídas, ajustes e inventário."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar produto ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-input bg-background h-10 flex-1 rounded-md border px-3 text-sm"
          aria-label="Buscar movimentações"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="h-10 w-full sm:w-48"
            aria-label="Filtrar tipo"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma movimentação"
          description="Registre entradas, saídas ou ajustes para gerar histórico."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <DataTable
                  data={filtered}
                  columns={columns}
                  keyExtractor={(m) => m.id}
                />
              </CardContent>
            </Card>
          </div>
          <ul className="space-y-3 md:hidden" aria-label="Movimentações">
            {filtered.map((m) => (
              <li key={m.id}>
                <Card className="shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {STOCK_MOVEMENT_LABELS[m.type]}
                      </Badge>
                      <span className="text-sm tabular-nums">
                        {m.quantity} un.
                      </span>
                    </div>
                    <p className="font-medium">{m.productName}</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {m.sku}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {m.previousBalance} → {m.currentBalance} · {m.reason}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {m.user} · {formatDateTime(m.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
