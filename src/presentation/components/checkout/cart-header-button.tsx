'use client';

import { ShoppingBag } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { useCartItemCount, useCartStore } from '@presentation/stores/cart';
import { cn } from '@shared/utils/cn';

export interface CartHeaderButtonProps {
  compact?: boolean;
}

export const CartHeaderButton = memo(function CartHeaderButton({
  compact = true,
}: CartHeaderButtonProps) {
  const itemCount = useCartItemCount();
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  return (
    <Button
      variant="ghost"
      size={compact ? 'icon' : 'default'}
      className={cn('relative', !compact && 'hidden gap-2 lg:inline-flex')}
      onClick={() => setDrawerOpen(true)}
      aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ''}`}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {!compact && (
        <span className="text-label hidden xl:inline">Carrinho</span>
      )}
      {itemCount > 0 && (
        <span className="bg-brand-bronze text-background absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[0.625rem] font-medium tabular-nums">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
});
