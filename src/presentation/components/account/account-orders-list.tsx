'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo, useEffect, useState } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { Badge, Button, Card, CardContent } from '@presentation/components/ui';
import { fetchAccountOrdersApi } from '@presentation/stores/account/account-orders.api';
import { ORDER_STATUS_LABELS } from '@shared/constants/account.constants';
import type { AccountOrder } from '@shared/types/account.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { AccountPageHeader } from './account-page-header';

export const AccountOrdersList = memo(function AccountOrdersList() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAccountOrdersApi();
        if (!cancelled) setOrders(data);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Erro ao carregar pedidos.',
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Não foi possível carregar seus pedidos"
        description={error}
        className="py-16"
      />
    );
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Meus Pedidos"
        description="Acompanhe o status e histórico de todas as suas compras."
      />

      {orders.length === 0 ? (
        <EmptyState
          title="Nenhum pedido encontrado"
          description="Quando você finalizar uma compra, ela aparecerá aqui."
          className="py-16"
        />
      ) : (
        <div className="space-y-4" role="list" aria-label="Lista de pedidos">
          {orders.map((order) => (
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
                  <Link href={`/pedidos/${order.id}` as Route}>
                    Ver detalhes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
