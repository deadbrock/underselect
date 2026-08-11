'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';

import { AdminChartBars } from '@presentation/components/admin/admin-chart-bars';
import { KpiGrid, ChartCard } from '@presentation/components/dashboard';
import { DataTable, type Column } from '@presentation/components/data-display';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useStockStore } from '@presentation/stores/admin/stock';
import {
  getDashboardStats,
  getMovementChartData,
  generateAlerts,
} from '@presentation/stores/admin/stock/stock.utils';
import { STOCK_MOVEMENT_LABELS } from '@shared/constants/stock.constants';
import type { StockMovement } from '@shared/types/stock.types';
import { formatCurrency, formatDateTime } from '@shared/utils/format';

import { StockAlertsBanner } from './stock-alerts-banner';

const movementColumns: Column<StockMovement>[] = [
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
      <div>
        <p className="text-sm font-medium">{m.productName}</p>
        <p className="text-muted-foreground font-mono text-xs">{m.sku}</p>
      </div>
    ),
  },
  {
    key: 'quantity',
    header: 'Qtd.',
    cell: (m) => <span className="tabular-nums">{m.quantity}</span>,
    hideOnMobile: true,
  },
  {
    key: 'balance',
    header: 'Saldo',
    cell: (m) => (
      <span className="text-muted-foreground text-xs tabular-nums">
        {m.previousBalance} → {m.currentBalance}
      </span>
    ),
    hideOnMobile: true,
  },
  {
    key: 'createdAt',
    header: 'Data',
    cell: (m) => formatDateTime(m.createdAt),
  },
];

export const StockDashboard = memo(function StockDashboard() {
  const stockItems = useStockStore((s) => s.stockItems);
  const movements = useStockStore((s) => s.movements);

  const stats = useMemo(() => getDashboardStats(stockItems), [stockItems]);
  const chartData = useMemo(() => getMovementChartData(movements), [movements]);
  const recentMovements = movements.slice(0, 5);
  const topAlerts = useMemo(
    () => generateAlerts(stockItems).slice(0, 3),
    [stockItems],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumo do Estoque"
        description="Indicadores, movimentações recentes e alertas do WMS UNDER SELECT."
      />

      {topAlerts.length > 0 && <StockAlertsBanner alerts={topAlerts} />}

      <KpiGrid
        items={[
          {
            title: 'Total em estoque',
            value: stats.totalQuantity.toLocaleString('pt-BR'),
          },
          { title: 'SKUs', value: stats.totalSkus },
          { title: 'Sem estoque', value: stats.outOfStock },
          { title: 'Estoque baixo', value: stats.lowStock },
        ]}
      />

      <KpiGrid
        columns={3}
        items={[
          { title: 'Em promoção', value: stats.onPromotion },
          {
            title: 'Valor estimado',
            value: formatCurrency(stats.estimatedValue),
            description: 'Baseado no custo unitário',
          },
          {
            title: 'Movimentações',
            value: movements.length,
            description: 'Registros no histórico',
          },
        ]}
      />

      <ChartCard
        title="Movimentações por tipo"
        description="Entradas, saídas e ajustes"
      >
        <AdminChartBars data={chartData} />
      </ChartCard>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            Últimas movimentações
          </CardTitle>
          <Link
            href="/admin/estoque/movimentacoes"
            className="text-label text-brand-bronze hover:underline"
          >
            Ver histórico
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <DataTable
              data={recentMovements}
              columns={movementColumns}
              keyExtractor={(m) => m.id}
              emptyMessage="Nenhuma movimentação registrada."
            />
          </div>
          <ul className="divide-border divide-y md:hidden">
            {recentMovements.map((m) => (
              <li key={m.id} className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {STOCK_MOVEMENT_LABELS[m.type]}
                  </Badge>
                  <span className="text-xs tabular-nums">{m.quantity} un.</span>
                </div>
                <p className="text-sm font-medium">{m.productName}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDateTime(m.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
});
