'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Card, CardContent } from '@presentation/components/ui';
import { OrderStatusBadge } from '@presentation/components/admin/order/order-status-badge';
import { ADMIN_PAYMENT_METHOD_LABELS } from '@shared/constants/order-admin.constants';
import type { AdminOrder } from '@shared/types/order-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

const columns: Column<AdminOrder>[] = [
  {
    key: 'number',
    header: 'Número',
    cell: (o) => (
      <Link
        href={`/admin/pedidos/${o.id}` as Route}
        className="text-brand-bronze font-mono text-sm hover:underline"
      >
        {o.number}
      </Link>
    ),
  },
  {
    key: 'createdAt',
    header: 'Data',
    cell: (o) => formatDate(o.createdAt),
    hideOnMobile: true,
  },
  {
    key: 'total',
    header: 'Valor',
    cell: (o) => (
      <span className="tabular-nums">{formatCurrency(o.total)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: 'payment',
    header: 'Pagamento',
    cell: (o) => ADMIN_PAYMENT_METHOD_LABELS[o.payment.method],
    hideOnMobile: true,
  },
  {
    key: 'coupon',
    header: 'Cupom',
    cell: (o) => o.couponCode ?? '—',
    hideOnMobile: true,
  },
  {
    key: 'influencer',
    header: 'Influenciador',
    cell: (o) => o.influencerCode ?? '—',
    hideOnMobile: true,
  },
  {
    key: 'items',
    header: 'Itens',
    cell: (o) => <span className="tabular-nums">{o.itemCount}</span>,
    hideOnMobile: true,
  },
];

export interface CustomerOrdersProps {
  orders: AdminOrder[];
}

export const CustomerOrders = memo(function CustomerOrders({
  orders,
}: CustomerOrdersProps) {
  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum pedido registrado para este cliente.
      </p>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <DataTable data={orders} columns={columns} keyExtractor={(o) => o.id} />
      </div>
      <ul className="space-y-3 md:hidden" aria-label="Pedidos do cliente">
        {orders.map((o) => (
          <li key={o.id}>
            <Card className="shadow-none">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/pedidos/${o.id}` as Route}
                    className="font-mono text-sm font-medium hover:underline"
                  >
                    {o.number}
                  </Link>
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="text-sm tabular-nums">
                  {formatCurrency(o.total)} · {o.itemCount} itens
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(o.createdAt)}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
});
