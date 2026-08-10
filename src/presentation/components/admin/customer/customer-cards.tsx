'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Card, CardContent } from '@presentation/components/ui';
import type { AdminCustomer } from '@shared/types/customer-admin.types';
import {
  formatCurrency,
  formatDate,
  formatPhone,
  maskCpf,
} from '@shared/utils/format';

import { CustomerStatusBadge } from './customer-status-badge';
import { CustomerTypeBadge } from './customer-type-badge';

export interface CustomerCardsProps {
  customers: AdminCustomer[];
}

export const CustomerCards = memo(function CustomerCards({
  customers,
}: CustomerCardsProps) {
  return (
    <ul className="space-y-3" aria-label="Clientes">
      {customers.map((customer) => (
        <li key={customer.id}>
          <Card className="shadow-none">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {customer.email}
                  </p>
                </div>
                <CustomerStatusBadge status={customer.status} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <CustomerTypeBadge type={customer.type} />
                <span className="font-mono">{maskCpf(customer.cpf)}</span>
                <span>{formatPhone(customer.phone)}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="tabular-nums">
                  {customer.orderCount} pedidos
                </span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(customer.totalSpent)}
                </span>
                {customer.lastPurchaseAt && (
                  <span>Última: {formatDate(customer.lastPurchaseAt)}</span>
                )}
              </div>
              <Link
                href={`/admin/clientes/${customer.id}` as Route}
                className="text-label text-brand-bronze inline-flex min-h-10 items-center hover:underline"
              >
                Ver perfil
              </Link>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
});
