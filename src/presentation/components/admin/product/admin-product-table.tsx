'use client';

import Image from 'next/image';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Badge } from '@presentation/components/ui';
import { ADMIN_PRODUCT_STATUS_LABELS } from '@shared/constants/product-admin.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';
import { shouldUnoptimizeImage } from '@shared/utils/media-src';

import { AdminProductActions } from './admin-product-actions';

function StatusBadge({ status }: { status: AdminProduct['status'] }) {
  return (
    <Badge variant="secondary">{ADMIN_PRODUCT_STATUS_LABELS[status]}</Badge>
  );
}

const columns: Column<AdminProduct>[] = [
  {
    key: 'image',
    header: 'Imagem',
    cell: (p) => (
      <div className="bg-muted relative size-12 overflow-hidden">
        <Image
          src={p.imageUrl}
          alt={p.imageAlt ?? p.name}
          fill
          className="object-cover"
          sizes="48px"
          unoptimized={shouldUnoptimizeImage(p.imageUrl)}
        />
      </div>
    ),
    className: 'w-16',
  },
  {
    key: 'name',
    header: 'Nome',
    cell: (p) => (
      <div className="min-w-[160px]">
        <p className="font-medium">{p.name}</p>
        <p className="text-muted-foreground font-mono text-xs">{p.sku}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Categoria',
    cell: (p) => p.categoryLabel,
    hideOnMobile: true,
  },
  {
    key: 'collection',
    header: 'Coleção',
    cell: (p) => p.collection,
    hideOnMobile: true,
  },
  {
    key: 'team',
    header: 'Time',
    cell: (p) => p.team ?? p.selection ?? '—',
    hideOnMobile: true,
  },
  {
    key: 'brand',
    header: 'Marca',
    cell: (p) => p.brand,
    hideOnMobile: true,
  },
  {
    key: 'price',
    header: 'Preço',
    cell: (p) => (
      <span className="tabular-nums">{formatCurrency(p.price)}</span>
    ),
  },
  {
    key: 'stock',
    header: 'Estoque',
    cell: (p) => (
      <span
        className={
          p.stockQuantity < 5 ? 'text-destructive tabular-nums' : 'tabular-nums'
        }
      >
        {p.stockQuantity}
      </span>
    ),
    hideOnMobile: true,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (p) => <StatusBadge status={p.status} />,
    hideOnMobile: true,
  },
  {
    key: 'createdAt',
    header: 'Cadastro',
    cell: (p) => formatDate(p.createdAt),
    hideOnMobile: true,
  },
  {
    key: 'actions',
    header: 'Ações',
    cell: (p) => <AdminProductActions product={p} />,
    className: 'w-[200px]',
  },
];

export interface AdminProductTableProps {
  products: AdminProduct[];
}

export const AdminProductTable = memo(function AdminProductTable({
  products,
}: AdminProductTableProps) {
  return (
    <DataTable
      data={products}
      columns={columns}
      keyExtractor={(p) => p.id}
      emptyMessage="Nenhum produto encontrado."
    />
  );
});
