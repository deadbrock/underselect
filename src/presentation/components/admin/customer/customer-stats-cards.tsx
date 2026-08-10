'use client';

import { memo } from 'react';

import { StatCard } from '@presentation/components/data-display';
import type { AdminCustomer } from '@shared/types/customer-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

export interface CustomerStatsCardsProps {
  customer: AdminCustomer;
}

export const CustomerStatsCards = memo(function CustomerStatsCards({
  customer,
}: CustomerStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Total gasto"
        value={formatCurrency(customer.totalSpent)}
      />
      <StatCard title="Pedidos" value={customer.orderCount} />
      <StatCard
        title="Ticket médio"
        value={formatCurrency(customer.averageTicket)}
      />
      <StatCard title="Produtos comprados" value={customer.productsPurchased} />
      <StatCard
        title="Última compra"
        value={formatDate(customer.lastPurchaseAt ?? '')}
      />
    </div>
  );
});
