'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Badge, Button, Card, CardContent } from '@presentation/components/ui';
import { MOCK_ACCOUNT_ORDERS } from '@shared/data/account.data';
import { ORDER_STATUS_LABELS } from '@shared/constants/account.constants';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { AccountPageHeader } from './account-page-header';

export const AccountOrdersList = memo(function AccountOrdersList() {
  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Meus Pedidos"
        description="Acompanhe o status e histórico de todas as suas compras."
      />

      <div className="space-y-4" role="list" aria-label="Lista de pedidos">
        {MOCK_ACCOUNT_ORDERS.map((order) => (
          <Card
            key={order.id}
            className="shadow-none transition-shadow hover:shadow-sm"
            role="listitem"
          >
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">
                    Pedido
                  </span>
                  <p className="font-mono text-sm font-medium">
                    {order.number}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">
                    Status
                  </span>
                  <p>
                    <Badge variant="secondary">
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">
                    Data
                  </span>
                  <p className="text-sm">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">
                    Itens / Total
                  </span>
                  <p className="text-sm tabular-nums">
                    {order.itemCount} · {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/pedidos/${order.id}` as Route}>Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});
