'use client';

import Image from 'next/image';
import { memo, useMemo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Badge } from '@presentation/components/ui';
import type { StockItem } from '@shared/types/stock.types';
import { formatDate } from '@shared/utils/format';

import { StockItemActions } from './stock-item-actions';
import { StockStatusBadge } from './stock-status-badge';

function variationLabel(item: StockItem) {
  return [item.size, item.color].filter(Boolean).join(' · ') || '—';
}

export interface StockTableProps {
  items: StockItem[];
  onSaveStock: (
    item: StockItem,
    values: { stock: number; minStock: number },
  ) => Promise<void>;
  onDeleteProduct: (item: StockItem) => Promise<void>;
  savingItemId?: string | null;
  deletingProductId?: string | null;
}

export const StockTable = memo(function StockTable({
  items,
  onSaveStock,
  onDeleteProduct,
  savingItemId,
  deletingProductId,
}: StockTableProps) {
  const columns: Column<StockItem>[] = useMemo(
    () => [
      {
        key: 'image',
        header: 'Imagem',
        cell: (item) => (
          <div className="bg-muted relative size-12 overflow-hidden">
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ),
        className: 'w-16',
      },
      {
        key: 'product',
        header: 'Produto',
        cell: (item) => (
          <div className="min-w-[140px]">
            <p className="font-medium">{item.productName}</p>
            {item.onSale && (
              <Badge variant="outline" className="mt-1 text-[0.625rem]">
                Promoção
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'sku',
        header: 'SKU',
        cell: (item) => <span className="font-mono text-xs">{item.sku}</span>,
        hideOnMobile: true,
      },
      {
        key: 'category',
        header: 'Categoria',
        cell: (item) => item.category,
        hideOnMobile: true,
      },
      {
        key: 'variation',
        header: 'Variação',
        cell: (item) => variationLabel(item),
        hideOnMobile: true,
      },
      {
        key: 'quantity',
        header: 'Qtd.',
        cell: (item) => (
          <span
            className={
              item.status === 'out' || item.status === 'low'
                ? 'text-destructive font-medium tabular-nums'
                : 'tabular-nums'
            }
          >
            {item.quantity}
          </span>
        ),
      },
      {
        key: 'minQuantity',
        header: 'Mín.',
        cell: (item) => (
          <span className="text-muted-foreground tabular-nums">
            {item.minQuantity}
          </span>
        ),
        hideOnMobile: true,
      },
      {
        key: 'status',
        header: 'Status',
        cell: (item) => <StockStatusBadge status={item.status} />,
      },
      {
        key: 'lastUpdated',
        header: 'Atualização',
        cell: (item) => formatDate(item.lastUpdated),
        hideOnMobile: true,
      },
      {
        key: 'actions',
        header: 'Ações',
        cell: (item) => (
          <StockItemActions
            item={item}
            onSaveStock={onSaveStock}
            onDeleteProduct={onDeleteProduct}
            isSaving={savingItemId === item.id}
            isDeleting={deletingProductId === item.productId}
          />
        ),
      },
    ],
    [onSaveStock, onDeleteProduct, savingItemId, deletingProductId],
  );

  return (
    <DataTable
      data={items}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="Nenhum item em estoque."
    />
  );
});
