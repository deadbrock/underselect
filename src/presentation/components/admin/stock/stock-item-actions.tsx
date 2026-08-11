'use client';

import { memo, useState } from 'react';
import { Pencil, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@presentation/components/ui';
import type { StockItem } from '@shared/types/stock.types';

import { StockEditDialog } from './stock-edit-dialog';

export interface StockItemActionsProps {
  item: StockItem;
  onSaveStock: (
    item: StockItem,
    values: { stock: number; minStock: number },
  ) => Promise<void>;
  onDeleteProduct: (item: StockItem) => Promise<void>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const StockItemActions = memo(function StockItemActions({
  item,
  onSaveStock,
  onDeleteProduct,
  isSaving = false,
  isDeleting = false,
}: StockItemActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={`Ajustar estoque de ${item.productName}`}
          onClick={() => setEditOpen(true)}
        >
          <Package className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={`Editar produto ${item.productName}`}
          asChild
        >
          <Link href={`/admin/produtos/${item.productId}/editar`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive size-8"
          aria-label={`Excluir produto ${item.productName}`}
          disabled={isDeleting}
          onClick={() => void onDeleteProduct(item)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <StockEditDialog
        item={item}
        open={editOpen}
        onOpenChange={setEditOpen}
        isSaving={isSaving}
        onSave={async (values) => {
          await onSaveStock(item, values);
          setEditOpen(false);
        }}
      />
    </>
  );
});
