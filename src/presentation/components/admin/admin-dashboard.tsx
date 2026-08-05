'use client';

import Link from 'next/link';
import { memo } from 'react';

import { KpiGrid } from '@presentation/components/dashboard';
import { ChartCard } from '@presentation/components/dashboard';
import { DataTable, type Column } from '@presentation/components/data-display';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
} from '@shared/constants/admin.constants';
import {
  MOCK_ADMIN_ACTIVITIES,
  MOCK_ADMIN_STATS,
  MOCK_ORDERS_CHART,
  MOCK_REVENUE_CHART,
  getAdminRecentOrders,
} from '@shared/mocks/admin.data';
import type { AdminListRow } from '@shared/types/admin.types';
import { formatCurrency, formatDateTime } from '@shared/utils/format';

import { AdminChartBars } from './admin-chart-bars';
import { AdminModuleActions } from './admin-module-actions';

function StatusBadge({ status }: { status: string }) {
  const label =
    ADMIN_ORDER_STATUS_LABELS[status] ?? ADMIN_STATUS_LABELS[status] ?? status;
  return <Badge variant="secondary">{label}</Badge>;
}

const orderColumns: Column<AdminListRow>[] = [
  {
    key: 'name',
    header: 'Pedido',
    cell: (row) => <span className="font-mono text-sm">{row.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge status={row.status} />,
    hideOnMobile: true,
  },
  {
    key: 'subtitle',
    header: 'Itens',
    cell: (row) => row.subtitle ?? '—',
    hideOnMobile: true,
  },
  {
    key: 'value',
    header: 'Total',
    cell: (row) => <span className="tabular-nums">{row.value ?? '—'}</span>,
  },
  {
    key: 'actions',
    header: '',
    cell: (row) => (
      <AdminModuleActions itemName={row.name} singularLabel="pedido" />
    ),
    className: 'w-[100px]',
  },
];

export const AdminDashboard = memo(function AdminDashboard() {
  const stats = MOCK_ADMIN_STATS;
  const recentOrders = getAdminRecentOrders().slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão executiva da UNDER SELECT em tempo real (dados mockados)."
      />

      <KpiGrid
        items={[
          {
            title: 'Faturamento',
            value: formatCurrency(stats.revenue),
            trend: { value: stats.revenueTrend, label: 'vs mês anterior' },
          },
          {
            title: 'Pedidos',
            value: stats.orders,
            trend: { value: stats.ordersTrend, label: 'vs mês anterior' },
          },
          {
            title: 'Clientes',
            value: stats.customers,
            trend: { value: stats.customersTrend, label: 'vs mês anterior' },
          },
          {
            title: 'Produtos',
            value: stats.products,
            trend: { value: stats.productsTrend, label: 'vs mês anterior' },
          },
        ]}
      />

      <KpiGrid
        columns={4}
        items={[
          { title: 'Estoque baixo', value: stats.lowStock },
          { title: 'Cupons utilizados', value: stats.couponsUsed },
          {
            title: 'Conversão',
            value: `${stats.conversionRate}%`,
          },
          {
            title: 'Ticket médio',
            value: formatCurrency(stats.averageTicket),
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Faturamento mensal" description="Últimos 8 meses">
          <AdminChartBars
            data={MOCK_REVENUE_CHART}
            formatValue={(v) =>
              new Intl.NumberFormat('pt-BR', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(v)
            }
          />
        </ChartCard>
        <ChartCard title="Pedidos por dia" description="Última semana">
          <AdminChartBars data={MOCK_ORDERS_CHART} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Últimos pedidos
            </CardTitle>
            <Link
              href="/admin/pedidos"
              className="text-label text-brand-bronze hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <DataTable
                data={recentOrders}
                columns={orderColumns}
                keyExtractor={(row) => row.id}
              />
            </div>
            <ul className="divide-border divide-y md:hidden">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-sm">{order.name}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="text-sm tabular-nums">{order.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Atividades recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4" aria-label="Atividades recentes">
              {MOCK_ADMIN_ACTIVITIES.map((activity) => (
                <li key={activity.id} className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-muted-foreground text-xs">
                    {activity.description}
                  </p>
                  <p className="text-muted-foreground text-[0.625rem]">
                    {activity.user} · {formatDateTime(activity.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
