'use client';

import { memo } from 'react';

import { Card, CardContent } from '@presentation/components/ui';
import { ADMIN_PAYMENT_METHOD_LABELS } from '@shared/constants/order-admin.constants';
import type { AdminOrder } from '@shared/types/order-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { OrderActions } from './order-actions';
import { OrderStatusBadge } from './order-status-badge';

export interface OrderCardsProps {
  orders: AdminOrder[];
}

export const OrderCards = memo(function OrderCards({
  orders,
}: OrderCardsProps) {
  return (
    <ul className="space-y-3" aria-label="Pedidos">
      {orders.map((order) => (
        <li key={order.id}>
          <Card className="shadow-none">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-medium">
                    {order.number}
                  </p>
                  <p className="text-sm">{order.customer.name}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="font-medium tabular-nums">
                  {formatCurrency(order.total)}
                </span>
                <span>{order.itemCount} un.</span>
                <span>{ADMIN_PAYMENT_METHOD_LABELS[order.payment.method]}</span>
                {order.couponCode && <span>Cupom {order.couponCode}</span>}
              </div>
              <time
                className="text-muted-foreground text-xs"
                dateTime={order.createdAt}
              >
                {formatDate(order.createdAt)}
              </time>
              <OrderActions order={order} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
});
