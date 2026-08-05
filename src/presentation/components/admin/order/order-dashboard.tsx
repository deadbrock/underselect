'use client';

import Link from 'next/link';
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
import { useOrderStore } from '@presentation/stores/admin/order';
import {
  getOrderDashboardStats,
  getOrdersChartData,
} from '@presentation/stores/admin/order/order.utils';
import type { AdminOrder } from '@shared/types/order-admin.types';
import { formatCurrency, formatDateTime } from '@shared/utils/format';

import { OrderStatusBadge } from './order-status-badge';

const MOCK_REVENUE = [
  { label: '08h', value: 1200 },
  { label: '10h', value: 2800 },
  { label: '12h', value: 4100 },
  { label: '14h', value: 3600 },
  { label: '16h', value: 5200 },
  { label: '18h', value: 4800 },
];

const recentColumns: Column<AdminOrder>[] = [
  {
    key: 'number',
    header: 'Pedido',
    cell: (o) => <span className="font-mono text-sm">{o.number}</span>,
  },
  {
    key: 'customer',
    header: 'Cliente',
    cell: (o) => o.customer.name,
    hideOnMobile: true,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: 'total',
    header: 'Valor',
    cell: (o) => (
      <span className="tabular-nums">{formatCurrency(o.total)}</span>
    ),
  },
  {
    key: 'createdAt',
    header: 'Data',
    cell: (o) => formatDateTime(o.createdAt),
    hideOnMobile: true,
  },
];

export const OrderDashboard = memo(function OrderDashboard() {
  const orders = useOrderStore((s) => s.orders);

  const stats = useMemo(() => getOrderDashboardStats(orders), [orders]);
  const chartData = useMemo(() => getOrdersChartData(orders), [orders]);
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumo de Pedidos"
        description="Visão operacional do OMS UNDER SELECT — indicadores e últimos pedidos."
      />

      <KpiGrid
        items={[
          { title: 'Pedidos hoje', value: stats.ordersToday },
          { title: 'Pendentes', value: stats.pendingOrders },
          { title: 'Pagos', value: stats.paidOrders },
          { title: 'Cancelados', value: stats.cancelledOrders },
        ]}
      />

      <KpiGrid
        columns={4}
        items={[
          {
            title: 'Ticket médio',
            value: formatCurrency(stats.averageTicket),
          },
          {
            title: 'Faturamento do dia',
            value: formatCurrency(stats.revenueToday),
          },
          { title: 'Em separação', value: stats.inSeparation },
          { title: 'Enviados', value: stats.shippedOrders },
        ]}
      />

      <KpiGrid
        columns={3}
        items={[{ title: 'Entregues', value: stats.deliveredOrders }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Pedidos por dia" description="Última semana (mock)">
          <AdminChartBars data={chartData} />
        </ChartCard>
        <ChartCard title="Faturamento do dia" description="Por hora (mock)">
          <AdminChartBars
            data={MOCK_REVENUE}
            formatValue={(v) =>
              new Intl.NumberFormat('pt-BR', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(v)
            }
          />
        </ChartCard>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            Últimos pedidos
          </CardTitle>
          <Link
            href="/admin/pedidos/lista"
            className="text-label text-brand-bronze hover:underline"
          >
            Ver todos
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <DataTable
              data={recent}
              columns={recentColumns}
              keyExtractor={(o) => o.id}
            />
          </div>
          <ul className="divide-border divide-y md:hidden">
            {recent.map((o) => (
              <li key={o.id} className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{o.number}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="text-sm">{o.customer.name}</p>
                <p className="text-muted-foreground text-xs tabular-nums">
                  {formatCurrency(o.total)} · {formatDateTime(o.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
});
