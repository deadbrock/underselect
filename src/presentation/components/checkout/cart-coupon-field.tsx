'use client';

import { memo, useState } from 'react';

import { Button, Input, Label } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';
import type { AppliedCoupon, CouponFeedback } from '@shared/types/cart.types';

export interface CartCouponFieldProps {
  appliedCoupon: AppliedCoupon | null;
  feedback: CouponFeedback | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  onClearFeedback?: () => void;
  className?: string;
}

const CartCouponField = memo(function CartCouponField({
  appliedCoupon,
  feedback,
  onApply,
  onRemove,
  onClearFeedback,
  className,
}: CartCouponFieldProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply(code);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label htmlFor="cart-coupon">Cupom de desconto</Label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id="cart-coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\s+/g, '').toUpperCase());
            onClearFeedback?.();
          }}
          placeholder="Digite seu cupom"
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="uppercase"
          aria-describedby={feedback ? 'coupon-feedback' : undefined}
          disabled={!!appliedCoupon}
        />
        {appliedCoupon ? (
          <Button type="button" variant="outline" onClick={onRemove}>
            Remover
          </Button>
        ) : (
          <Button type="submit" variant="outline">
            Aplicar
          </Button>
        )}
      </form>

      {appliedCoupon && (
        <p className="text-brand-bronze text-sm" role="status">
          {appliedCoupon.label} ({appliedCoupon.code})
        </p>
      )}

      {feedback && (
        <p
          id="coupon-feedback"
          role="status"
          className={cn(
            'text-sm',
            feedback.type === 'success' && 'text-brand-bronze',
            feedback.type === 'invalid' && 'text-destructive',
            feedback.type === 'expired' && 'text-muted-foreground',
          )}
        >
          {feedback.message}
        </p>
      )}

      <p className="text-muted-foreground text-xs">
        O cupom é validado no servidor com as regras configuradas no painel.
      </p>
    </div>
  );
});

export { CartCouponField };
