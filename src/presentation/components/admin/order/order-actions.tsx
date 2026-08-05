'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Copy, Eye, MoreHorizontal, Printer, Tag, XCircle } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@presentation/components/ui';
import { useOrderStore } from '@presentation/stores/admin/order';
import { toast } from '@presentation/hooks';
import type { AdminOrder } from '@shared/types/order-admin.types';

export interface OrderActionsProps {
  order: AdminOrder;
  compact?: boolean;
}

export const OrderActions = memo(function OrderActions({
  order,
  compact = false,
}: OrderActionsProps) {
  const router = useRouter();
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const duplicateOrder = useOrderStore((s) => s.duplicateOrder);

  const handleCancel = () => {
    if (order.status === 'cancelled') return;
    cancelOrder(order.id);
    toast.success(`Pedido ${order.number} cancelado.`);
  };

  const handleDuplicate = () => {
    const dup = duplicateOrder(order.id);
    if (dup) {
      toast.success(`Pedido duplicado: ${dup.number}`);
      router.push(`/admin/pedidos/${dup.id}` as Route);
    }
  };

  const handlePlaceholder = (action: string) => {
    toast.info(`${action} — integração preparada para próxima fase.`);
  };

  if (compact) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-9"
        asChild
      >
        <Link href={`/admin/pedidos/${order.id}` as Route}>Ver</Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" className="min-h-10 flex-1 sm:flex-none" asChild>
        <Link href={`/admin/pedidos/${order.id}` as Route}>
          <Eye className="mr-2 size-4" />
          Visualizar
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="min-h-10"
            aria-label="Mais ações"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handlePlaceholder('Imprimir pedido')}
          >
            <Printer className="mr-2 size-4" />
            Imprimir pedido
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePlaceholder('Imprimir etiqueta')}
          >
            <Tag className="mr-2 size-4" />
            Imprimir etiqueta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePlaceholder('Reenviar confirmação')}
          >
            Reenviar confirmação
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 size-4" />
            Duplicar pedido
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCancel}
            disabled={order.status === 'cancelled'}
            className="text-destructive"
          >
            <XCircle className="mr-2 size-4" />
            Cancelar pedido
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
