'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Ban, Eye, MoreHorizontal, Pencil, Unlock } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@presentation/components/ui';
import { useCustomerStore } from '@presentation/stores/admin/customer';
import { toast } from '@presentation/hooks';
import type { AdminCustomer } from '@shared/types/customer-admin.types';

export interface CustomerActionsProps {
  customer: AdminCustomer;
}

export const CustomerActions = memo(function CustomerActions({
  customer,
}: CustomerActionsProps) {
  const blockCustomer = useCustomerStore((s) => s.blockCustomer);
  const unblockCustomer = useCustomerStore((s) => s.unblockCustomer);

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" className="min-h-10" asChild>
        <Link href={`/admin/clientes/${customer.id}` as Route}>
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
            onClick={() =>
              toast.info('Edição de dados — integração preparada.')
            }
          >
            <Pencil className="mr-2 size-4" />
            Editar dados
          </DropdownMenuItem>
          {customer.status === 'blocked' ? (
            <DropdownMenuItem
              onClick={() => {
                unblockCustomer(customer.id);
                toast.success('Cliente desbloqueado.');
              }}
            >
              <Unlock className="mr-2 size-4" />
              Desbloquear
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                blockCustomer(customer.id);
                toast.success('Cliente bloqueado.');
              }}
              className="text-destructive"
            >
              <Ban className="mr-2 size-4" />
              Bloquear cliente
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/clientes/${customer.id}#pedidos` as Route}>
              Ver pedidos
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
