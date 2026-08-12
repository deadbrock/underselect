'use client';

import Link from 'next/link';
import { memo, useEffect, useMemo } from 'react';

import { AdminChartBars } from '@presentation/components/admin/admin-chart-bars';
import { Spinner } from '@presentation/components/feedback';
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
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const isLoading = useOrderStore((s) => s.isLoading);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const stats = useMemo(() => getOrderDashboardStats(orders), [orders]);
  const chartData = useMemo(() => getOrdersChartData(orders), [orders]);
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumo de Pedidos"
        description="Visão operacional do OMS UNDER SELECT — indicadores e últimos pedidos."
      />

      {isLoading && orders.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>
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

          <ChartCard title="Pedidos por dia" description="Última semana">
            <AdminChartBars data={chartData} />
          </ChartCard>

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
        </>
      )}
    </div>
  );
});
