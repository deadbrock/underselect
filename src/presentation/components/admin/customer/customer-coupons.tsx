'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import type { AdminCustomerCouponUsage } from '@shared/types/customer-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

export interface CustomerCouponsProps {
  usages: AdminCustomerCouponUsage[];
}

export const CustomerCoupons = memo(function CustomerCoupons({
  usages,
}: CustomerCouponsProps) {
  if (usages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum cupom utilizado por este cliente.
      </p>
    );
  }

  return (
    <ul
      className="divide-border divide-y rounded-md border"
      aria-label="Cupons"
    >
      {usages.map((u) => (
        <li key={u.id} className="space-y-1 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{u.code}</Badge>
            <span className="text-sm">{u.discountLabel}</span>
            <span className="text-muted-foreground text-xs tabular-nums">
              -{formatCurrency(u.discountAmount)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Pedido{' '}
            <Link
              href={`/admin/pedidos/${u.orderId}` as Route}
              className="text-brand-bronze hover:underline"
            >
              {u.orderNumber}
            </Link>
            {u.influencerCode && ` · Influenciador ${u.influencerCode}`}
          </p>
          <time className="text-muted-foreground text-xs" dateTime={u.usedAt}>
            {formatDate(u.usedAt)}
          </time>
        </li>
      ))}
    </ul>
  );
});
