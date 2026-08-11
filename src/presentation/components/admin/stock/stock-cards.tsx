'use client';

import Image from 'next/image';
import { memo } from 'react';

import { Badge, Card, CardContent } from '@presentation/components/ui';
import type { StockItem } from '@shared/types/stock.types';
import { formatDate } from '@shared/utils/format';

import { StockItemActions } from './stock-item-actions';
import { StockStatusBadge } from './stock-status-badge';

export interface StockCardsProps {
  items: StockItem[];
  onSaveStock: (
    item: StockItem,
    values: { stock: number; minStock: number },
  ) => Promise<void>;
  onDeleteProduct: (item: StockItem) => Promise<void>;
  savingItemId?: string | null;
  deletingProductId?: string | null;
}

export const StockCards = memo(function StockCards({
  items,
  onSaveStock,
  onDeleteProduct,
  savingItemId,
  deletingProductId,
}: StockCardsProps) {
  return (
    <ul className="space-y-3" aria-label="Itens em estoque">
      {items.map((item) => (
        <li key={item.id}>
          <Card className="shadow-none">
            <CardContent className="flex gap-3 p-4">
              <div className="bg-muted relative size-20 shrink-0 overflow-hidden">
                <Image
                  src={item.productImageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-medium">{item.productName}</p>
                  <StockStatusBadge status={item.status} />
                </div>
                <p className="text-muted-foreground font-mono text-xs">
                  {item.sku}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-medium tabular-nums">
                    Qtd. {item.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    Mín. {item.minQuantity}
                  </span>
                  {item.size && <span>{item.size}</span>}
                  {item.color && <span>{item.color}</span>}
                  {item.onSale && (
                    <Badge variant="outline" className="text-[0.625rem]">
                      Promoção
                    </Badge>
                  )}
                </div>
                <time
                  className="text-muted-foreground text-xs"
                  dateTime={item.lastUpdated}
                >
                  {formatDate(item.lastUpdated)}
                </time>
                <StockItemActions
                  item={item}
                  onSaveStock={onSaveStock}
                  onDeleteProduct={onDeleteProduct}
                  isSaving={savingItemId === item.id}
                  isDeleting={deletingProductId === item.productId}
                />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
});
