'use client';

import { memo, useMemo } from 'react';

import { AdminChartBars } from '@presentation/components/admin/admin-chart-bars';
import { KpiGrid, ChartCard } from '@presentation/components/dashboard';
import { DataTable, type Column } from '@presentation/components/data-display';
import {
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
  getTopMovedProducts,
} from '@presentation/stores/admin/stock/stock.utils';
import { formatCurrency } from '@shared/utils/format';

interface TopProduct {
  name: string;
  count: number;
}

export const StockReports = memo(function StockReports() {
  const stockItems = useStockStore((s) => s.stockItems);
  const movements = useStockStore((s) => s.movements);

  const stats = useMemo(() => getDashboardStats(stockItems), [stockItems]);
  const topMoved = useMemo(() => getTopMovedProducts(movements), [movements]);
  const typeChart = useMemo(() => getMovementChartData(movements), [movements]);

  const critical = useMemo(
    () =>
      stockItems
        .filter((i) => i.status === 'out' || i.status === 'low')
        .slice(0, 5)
        .map((i) => ({ name: i.productName, count: i.quantity })),
    [stockItems],
  );

  const stale = useMemo(
    () =>
      stockItems
        .filter((i) => i.status === 'ok')
        .slice(0, 5)
        .map((i) => ({ name: i.productName, count: i.quantity })),
    [stockItems],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios de Estoque"
        description="Entradas, saídas, produtos críticos e valor estimado."
      />

      <KpiGrid
        columns={3}
        items={[
          {
            title: 'Valor estimado',
            value: formatCurrency(stats.estimatedValue),
          },
          {
            title: 'Produtos críticos',
            value: stats.outOfStock + stats.lowStock,
          },
          { title: 'Total movimentações', value: movements.length },
        ]}
      />

      <ChartCard
        title="Movimentações por tipo"
        description="Distribuição atual"
      >
        <AdminChartBars data={typeChart} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportTable title="Produtos mais movimentados" data={topMoved} />
        <ReportTable
          title="Produtos críticos"
          data={critical}
          valueLabel="Qtd."
        />
      </div>

      <ReportTable
        title="Produtos sem movimentação recente"
        data={stale}
        valueLabel="Qtd."
      />
    </div>
  );
});

function ReportTable({
  title,
  data,
  valueLabel = 'Movimentado',
}: {
  title: string;
  data: TopProduct[];
  valueLabel?: string;
}) {
  const columns: Column<TopProduct>[] = [
    { key: 'name', header: 'Produto', cell: (r) => r.name },
    {
      key: 'count',
      header: valueLabel,
      cell: (r) => <span className="tabular-nums">{r.count}</span>,
    },
  ];

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          data={data}
          columns={columns}
          keyExtractor={(r) => r.name}
          emptyMessage="Sem dados."
        />
      </CardContent>
    </Card>
  );
}
