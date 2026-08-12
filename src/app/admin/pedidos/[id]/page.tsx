'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';

import { OrderDetail } from '@presentation/components/admin/order';
import { Spinner } from '@presentation/components/feedback';
import { Button } from '@presentation/components/ui';
import { useOrderStore } from '@presentation/stores/admin/order';
import type { AdminOrder } from '@shared/types/order-admin.types';

interface PedidoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export default function PedidoDetalhePage({ params }: PedidoDetalhePageProps) {
  const { id } = use(params);
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const fetchOrderById = useOrderStore((s) => s.fetchOrderById);
  const [order, setOrder] = useState<AdminOrder | undefined>(() =>
    getOrderById(id),
  );
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      const cached = getOrderById(id);
      if (cached) {
        setOrder(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetched = await fetchOrderById(id);
      if (!cancelled) {
        setOrder(fetched);
        setIsLoading(false);
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [fetchOrderById, getOrderById, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button asChild className="mt-4 min-h-10">
          <Link href="/admin/pedidos/lista">Voltar aos pedidos</Link>
        </Button>
      </div>
    );
  }

  return <OrderDetail order={order} />;
}
