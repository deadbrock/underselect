import { memo } from 'react';

import { Separator } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';

export interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  total: number;
  className?: string;
}

const CartSummary = memo(function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  className,
}: CartSummaryProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <Price value={subtotal} size="sm" />
      </div>
      {shipping !== undefined && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frete</span>
          <Price value={shipping} size="sm" />
        </div>
      )}
      {discount !== undefined && discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Desconto</span>
          <span className="text-brand-bronze text-sm tabular-nums">
            -
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(discount)}
          </span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between">
        <span className="text-label">Total</span>
        <Price value={total} size="md" />
      </div>
    </div>
  );
});

export { CartSummary };
