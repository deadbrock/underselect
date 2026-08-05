'use client';

import Link from 'next/link';
import { use } from 'react';

import { OrderDetail } from '@presentation/components/admin/order';
import { Button } from '@presentation/components/ui';
import { useOrderStore } from '@presentation/stores/admin/order';

interface PedidoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export default function PedidoDetalhePage({ params }: PedidoDetalhePageProps) {
  const { id } = use(params);
  const order = useOrderStore((s) => s.getOrderById(id));

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
