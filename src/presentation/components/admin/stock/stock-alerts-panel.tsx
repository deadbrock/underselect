'use client';

import {
  AlertTriangle,
  PackageX,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { EmptyState } from '@presentation/components/feedback';
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
import { generateAlerts } from '@presentation/stores/admin/stock/stock.utils';
import { STOCK_ALERT_LABELS } from '@shared/constants/stock.constants';
import type { StockAlertType } from '@shared/types/stock.types';
import { formatDateTime } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';

const ICONS: Record<StockAlertType, typeof AlertTriangle> = {
  low: TrendingDown,
  out: PackageX,
  stale: AlertTriangle,
  excess: TrendingUp,
};

const VARIANT: Record<StockAlertType, string> = {
  low: 'border-amber-500/30 bg-amber-500/5',
  out: 'border-destructive/30 bg-destructive/5',
  stale: 'border-border bg-muted/30',
  excess: 'border-blue-500/30 bg-blue-500/5',
};

export const StockAlertsPanel = memo(function StockAlertsPanel() {
  const stockItems = useStockStore((s) => s.stockItems);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const alerts = useMemo(() => generateAlerts(stockItems), [stockItems]);

  const filtered =
    typeFilter === 'all' ? alerts : alerts.filter((a) => a.type === typeFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas de Estoque"
        description="Estoque baixo, ruptura, produtos parados e excesso — ação imediata."
      />

      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger
          className="h-10 w-full sm:w-48"
          aria-label="Filtrar alertas"
        >
          <SelectValue placeholder="Tipo de alerta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {Object.entries(STOCK_ALERT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum alerta"
          description="O estoque está dentro dos parâmetros configurados."
          className="py-16"
        />
      ) : (
        <ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Alertas"
        >
          {filtered.map((alert) => {
            const Icon = ICONS[alert.type];
            return (
              <li key={alert.id}>
                <Card className={cn('shadow-none', VARIANT[alert.type])}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <Badge variant="outline">
                        {STOCK_ALERT_LABELS[alert.type]}
                      </Badge>
                    </div>
                    <p className="font-medium">{alert.productName}</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {alert.sku}
                    </p>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-muted-foreground text-xs">
                      Qtd. {alert.quantity}
                      {alert.minQuantity !== undefined &&
                        ` · Mín. ${alert.minQuantity}`}
                    </p>
                    <time className="text-muted-foreground text-[0.625rem]">
                      {formatDateTime(alert.createdAt)}
                    </time>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
