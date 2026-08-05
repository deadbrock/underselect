'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Bookmark, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { QuantityStepper } from '@presentation/components/forms';
import { formatCartVariant } from '@presentation/stores/cart';
import type { CartLineItem } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

export interface CartPageItemProps {
  item: CartLineItem;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onSaveForLater?: (lineId: string) => void;
  className?: string;
}

const CartPageItem = memo(function CartPageItem({
  item,
  onQuantityChange,
  onRemove,
  onSaveForLater,
  className,
}: CartPageItemProps) {
  const lineTotal = item.price * item.quantity;
  const entity = item.team ?? item.selection;

  return (
    <article
      className={cn(
        'border-border flex gap-4 border-b py-6 md:gap-6',
        className,
      )}
      aria-label={item.name}
    >
      <Link
        href={`/produto/${item.slug}` as Route}
        className="bg-muted relative size-24 shrink-0 overflow-hidden md:size-32"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover transition-transform hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-muted-foreground text-[0.625rem] tracking-[0.15em] uppercase">
              {item.categoryLabel}
              {entity ? ` · ${entity}` : ''}
            </p>
            <Link
              href={`/produto/${item.slug}` as Route}
              className="hover:text-brand-bronze block text-sm font-normal transition-colors md:text-base"
            >
              {item.name}
            </Link>
            <p className="text-muted-foreground text-xs">
              {formatCartVariant(item)}
            </p>
          </div>

          <div className="text-left md:text-right">
            <Price
              value={item.price}
              compareAt={item.compareAtPrice}
              size="sm"
            />
            <p className="text-muted-foreground mt-1 text-xs tabular-nums">
              Subtotal:{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(lineTotal)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(qty) => onQuantityChange(item.lineId, qty)}
          />

          <div className="flex items-center gap-2">
            {onSaveForLater && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSaveForLater(item.lineId)}
                aria-label="Salvar para depois"
              >
                <Bookmark className="mr-1 size-4" aria-hidden />
                Salvar
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.lineId)}
              aria-label={`Remover ${item.name}`}
              className="text-muted-foreground"
            >
              <Trash2 className="mr-1 size-4" aria-hidden />
              Remover
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});

export { CartPageItem };
