'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import type { CartTotals } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

export interface CheckoutMobileBarProps {
  totals: CartTotals;
  isProcessing: boolean;
  onSubmit: () => void;
  className?: string;
}

export const CheckoutMobileBar = memo(function CheckoutMobileBar({
  totals,
  isProcessing,
  onSubmit,
  className,
}: CheckoutMobileBarProps) {
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
        </div>
        <Button
          variant="bronze"
          size="lg"
          className="shrink-0 px-6"
          disabled={isProcessing}
          onClick={onSubmit}
        >
          {isProcessing ? 'Processando...' : 'Finalizar'}
        </Button>
      </div>
    </div>
  );
});
