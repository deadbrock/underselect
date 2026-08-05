'use client';

import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import {
  ADMIN_PAYMENT_METHOD_LABELS,
  ADMIN_SHIPPING_CARRIER_LABELS,
} from '@shared/constants/order-admin.constants';
import type { AdminOrder } from '@shared/types/order-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { OrderActions } from './order-actions';
import { OrderStatusBadge } from './order-status-badge';

const columns: Column<AdminOrder>[] = [
  {
    key: 'number',
    header: 'Número',
    cell: (o) => (
      <span className="font-mono text-sm font-medium">{o.number}</span>
    ),
  },
  {
    key: 'customer',
    header: 'Cliente',
    cell: (o) => (
      <div className="min-w-[140px]">
        <p className="font-medium">{o.customer.name}</p>
        <p className="text-muted-foreground text-xs">{o.customer.email}</p>
      </div>
    ),
  },
  {
    key: 'products',
    header: 'Produtos',
    cell: (o) => (
      <span className="text-sm">
        {o.items.length} {o.items.length === 1 ? 'item' : 'itens'}
      </span>
    ),
    hideOnMobile: true,
  },
  {
    key: 'quantity',
    header: 'Qtd.',
    cell: (o) => <span className="tabular-nums">{o.itemCount}</span>,
    hideOnMobile: true,
  },
  {
    key: 'total',
    header: 'Valor',
    cell: (o) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(o.total)}
      </span>
    ),
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
    key: 'payment',
    header: 'Pagamento',
    cell: (o) => ADMIN_PAYMENT_METHOD_LABELS[o.payment.method],
    hideOnMobile: true,
  },
  {
    key: 'shipping',
    header: 'Entrega',
    cell: (o) => ADMIN_SHIPPING_CARRIER_LABELS[o.shippingInfo.carrier],
    hideOnMobile: true,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: 'createdAt',
    header: 'Data',
    cell: (o) => formatDate(o.createdAt),
    hideOnMobile: true,
  },
  {
    key: 'actions',
    header: 'Ações',
    cell: (o) => <OrderActions order={o} compact />,
    className: 'w-[120px]',
  },
];

export interface OrderTableProps {
  orders: AdminOrder[];
}

export const OrderTable = memo(function OrderTable({
  orders,
}: OrderTableProps) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      keyExtractor={(o) => o.id}
      emptyMessage="Nenhum pedido encontrado."
    />
  );
});
