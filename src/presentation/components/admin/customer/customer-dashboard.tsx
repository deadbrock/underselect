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
import { useCustomerStore } from '@presentation/stores/admin/customer';
import {
  getCustomerDashboardStats,
  getCustomersChartData,
} from '@presentation/stores/admin/customer/customer.utils';
import type { AdminCustomer } from '@shared/types/customer-admin.types';
import { formatCurrency, formatDate, maskCpf } from '@shared/utils/format';

import { CustomerStatusBadge } from './customer-status-badge';
import { CustomerTypeBadge } from './customer-type-badge';

const recentColumns: Column<AdminCustomer>[] = [
  {
    key: 'name',
    header: 'Cliente',
    cell: (c) => (
      <div>
        <p className="font-medium">{c.name}</p>
        <p className="text-muted-foreground font-mono text-xs">
          {maskCpf(c.cpf)}
        </p>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Tipo',
    cell: (c) => <CustomerTypeBadge type={c.type} />,
    hideOnMobile: true,
  },
  {
    key: 'orderCount',
    header: 'Pedidos',
    cell: (c) => <span className="tabular-nums">{c.orderCount}</span>,
  },
  {
    key: 'totalSpent',
    header: 'Total',
    cell: (c) => (
      <span className="tabular-nums">{formatCurrency(c.totalSpent)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (c) => <CustomerStatusBadge status={c.status} />,
    hideOnMobile: true,
  },
  {
    key: 'lastPurchaseAt',
    header: 'Última compra',
    cell: (c) => formatDate(c.lastPurchaseAt ?? ''),
    hideOnMobile: true,
  },
];

export const CustomerDashboard = memo(function CustomerDashboard() {
  const customers = useCustomerStore((s) => s.customers);

  const stats = useMemo(
    () => getCustomerDashboardStats(customers),
    [customers],
  );
  const chartData = useMemo(
    () => getCustomersChartData(customers),
    [customers],
  );
  const recent = [...customers]
    .sort(
      (a, b) =>
        new Date(b.lastPurchaseAt ?? b.createdAt).getTime() -
        new Date(a.lastPurchaseAt ?? a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumo de Clientes"
        description="CRM UNDER SELECT — indicadores, segmentação e relacionamento."
      />

      <KpiGrid
        items={[
          { title: 'Total de clientes', value: stats.totalCustomers },
          { title: 'Novos clientes', value: stats.newCustomers },
          { title: 'Recorrentes', value: stats.recurringCustomers },
          { title: 'Inativos', value: stats.inactiveCustomers },
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
            title: 'Compraram no período',
            value: stats.purchasedInPeriod,
          },
          {
            title: 'Taxa de recorrência',
            value: `${stats.recurrenceRate}%`,
          },
          {
            title: 'Valor total comprado',
            value: formatCurrency(stats.totalRevenue),
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Novos clientes" description="Últimos 6 meses">
          <AdminChartBars data={chartData} />
        </ChartCard>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            Clientes recentes
          </CardTitle>
          <Link
            href="/admin/clientes/lista"
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
              keyExtractor={(c) => c.id}
            />
          </div>
          <ul className="divide-border divide-y md:hidden">
            {recent.map((c) => (
              <li key={c.id} className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{c.name}</span>
                  <CustomerTypeBadge type={c.type} />
                </div>
                <p className="text-muted-foreground text-xs tabular-nums">
                  {formatCurrency(c.totalSpent)} · {c.orderCount} pedidos
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
});
