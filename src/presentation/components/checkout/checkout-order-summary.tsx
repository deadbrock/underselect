'use client';

import Image from 'next/image';
import { memo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { formatCartVariant, useCartStore } from '@presentation/stores/cart';
import type { CartLineItem, CartTotals } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

import { CartCouponField } from './cart-coupon-field';
import { CartSummary } from './cart-summary';
import type { AppliedCoupon, CouponFeedback } from '@shared/types/cart.types';

export interface CheckoutOrderSummaryProps {
  items: CartLineItem[];
  totals: CartTotals;
  appliedCoupon: AppliedCoupon | null;
  couponFeedback: CouponFeedback | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onClearCouponFeedback: () => void;
  sticky?: boolean;
  className?: string;
}

export const CheckoutOrderSummary = memo(function CheckoutOrderSummary({
  items,
  totals,
  appliedCoupon,
  couponFeedback,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCouponFeedback,
  sticky = true,
  className,
}: CheckoutOrderSummaryProps) {
  const shippingQuote = useCartStore((state) => state.shippingQuote);
  const totalDiscount = totals.catalogDiscount + totals.couponDiscount;

  return (
    <Card
      className={cn(
        sticky && 'lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]',
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-medium tracking-tight">
          Resumo do pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul
          className="max-h-64 space-y-4 overflow-y-auto pr-1"
          aria-label="Itens"
        >
          {items.map((item) => (
            <li key={item.lineId} className="flex gap-3">
              <div className="bg-muted relative size-16 shrink-0 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm">{item.name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatCartVariant(item)} · Qtd. {item.quantity}
                </p>
                <p className="mt-1 text-sm tabular-nums">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <CartCouponField
          appliedCoupon={appliedCoupon}
          feedback={couponFeedback}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
          onClearFeedback={onClearCouponFeedback}
        />

        <CartSummary
          subtotal={totals.subtotal}
          shipping={shippingQuote ? totals.shipping : undefined}
          discount={totalDiscount > 0 ? totalDiscount : undefined}
          total={totals.total}
        />

        {totals.total > 0 && (
          <p className="text-muted-foreground text-sm">
            ou {totals.installmentCount}x de{' '}
            <span className="text-foreground font-medium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totals.installmentValue)}
            </span>{' '}
            sem juros
          </p>
        )}
      </CardContent>
    </Card>
  );
});
