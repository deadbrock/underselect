'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import type { CartTotals } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

export interface CartMobileCheckoutBarProps {
  totals: CartTotals;
  className?: string;
}

const CartMobileCheckoutBar = memo(function CartMobileCheckoutBar({
  totals,
  className,
}: CartMobileCheckoutBarProps) {
  if (totals.itemCount === 0) return null;

  return (
    <div
      className={cn(
        'border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden',
        className,
      )}
      role="region"
      aria-label="Finalizar compra"
    >
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 flex-1">
          <Price value={totals.total} size="sm" />
          <p className="text-muted-foreground text-xs">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <Button variant="bronze" size="lg" className="shrink-0 px-6" asChild>
          <Link href={'/checkout' as Route}>Finalizar</Link>
        </Button>
      </div>
    </div>
  );
});

export { CartMobileCheckoutBar };
