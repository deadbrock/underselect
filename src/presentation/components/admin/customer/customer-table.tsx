'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import type { AdminCustomer } from '@shared/types/customer-admin.types';
import {
  formatCurrency,
  formatDate,
  formatPhone,
  maskCpf,
} from '@shared/utils/format';

import { CustomerStatusBadge } from './customer-status-badge';
import { CustomerTypeBadge } from './customer-type-badge';

const columns: Column<AdminCustomer>[] = [
  {
    key: 'name',
    header: 'Nome',
    cell: (c) => <span className="font-medium">{c.name}</span>,
  },
  {
    key: 'email',
    header: 'E-mail',
    cell: (c) => (
      <span className="text-muted-foreground text-sm">{c.email}</span>
    ),
    hideOnMobile: true,
  },
  {
    key: 'phone',
    header: 'Telefone',
    cell: (c) => formatPhone(c.phone),
    hideOnMobile: true,
  },
  {
    key: 'cpf',
    header: 'CPF',
    cell: (c) => <span className="font-mono text-xs">{maskCpf(c.cpf)}</span>,
    hideOnMobile: true,
  },
  {
    key: 'orderCount',
    header: 'Pedidos',
    cell: (c) => <span className="tabular-nums">{c.orderCount}</span>,
  },
  {
    key: 'totalSpent',
    header: 'Total',
    cell: (c) => (
      <span className="tabular-nums">{formatCurrency(c.totalSpent)}</span>
    ),
  },
  {
    key: 'lastPurchaseAt',
    header: 'Última compra',
    cell: (c) => formatDate(c.lastPurchaseAt ?? ''),
    hideOnMobile: true,
  },
  {
    key: 'createdAt',
    header: 'Cadastro',
    cell: (c) => formatDate(c.createdAt),
    hideOnMobile: true,
  },
  {
    key: 'type',
    header: 'Tipo',
    cell: (c) => <CustomerTypeBadge type={c.type} />,
    hideOnMobile: true,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (c) => <CustomerStatusBadge status={c.status} />,
  },
  {
    key: 'actions',
    header: 'Ações',
    cell: (c) => (
      <Link
        href={`/admin/clientes/${c.id}` as Route}
        className="text-label text-brand-bronze hover:underline"
      >
        Ver
      </Link>
    ),
    className: 'w-16',
  },
];

export interface CustomerTableProps {
  customers: AdminCustomer[];
}

export const CustomerTable = memo(function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
    <DataTable
      data={customers}
      columns={columns}
      keyExtractor={(c) => c.id}
      emptyMessage="Nenhum cliente encontrado."
    />
  );
});
