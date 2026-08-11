'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import type {
  AppliedCoupon,
  CartTotals,
  CouponFeedback,
  ShippingQuote,
} from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

import { CartCouponField } from './cart-coupon-field';
import { CartShippingForm } from './cart-shipping-form';
import { CartSummary } from './cart-summary';

export interface CartOrderSummaryProps {
  totals: CartTotals;
  appliedCoupon: AppliedCoupon | null;
  couponFeedback: CouponFeedback | null;
  shippingCep: string;
  shippingQuote: ShippingQuote | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onClearCouponFeedback: () => void;
  onShippingCepChange: (cep: string) => void;
  onCalculateShipping: (cep: string) => Promise<void>;
  onSelectShippingOption: (optionId: string) => void;
  onCheckout?: () => void;
  sticky?: boolean;
  showExtras?: boolean;
  className?: string;
}

const CartOrderSummary = memo(function CartOrderSummary({
  totals,
  appliedCoupon,
  couponFeedback,
  shippingCep,
  shippingQuote,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCouponFeedback,
  onShippingCepChange,
  onCalculateShipping,
  onSelectShippingOption,
  onCheckout,
  sticky = true,
  showExtras = true,
  className,
}: CartOrderSummaryProps) {
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
        {showExtras && (
          <>
            <CartCouponField
              appliedCoupon={appliedCoupon}
              feedback={couponFeedback}
              onApply={onApplyCoupon}
              onRemove={onRemoveCoupon}
              onClearFeedback={onClearCouponFeedback}
            />
            <CartShippingForm
              cep={shippingCep}
              quote={shippingQuote}
              onCepChange={onShippingCepChange}
              onCalculate={onCalculateShipping}
              onSelectOption={onSelectShippingOption}
            />
          </>
        )}

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

        <Button size="lg" className="hidden w-full lg:inline-flex" asChild>
          <Link href={'/checkout' as Route} onClick={onCheckout}>
            Finalizar compra
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
});

export { CartOrderSummary };
