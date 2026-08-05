'use client';

import { memo } from 'react';

import { Breadcrumb, Button } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import { useCartStore, useCartTotals } from '@presentation/stores/cart';

import { CartEmptyState } from './cart-empty-state';
import { CartMobileCheckoutBar } from './cart-mobile-checkout-bar';
import { CartOrderSummary } from './cart-order-summary';
import { CartPageItem } from './cart-page-item';

export const CartExperience = memo(function CartExperience() {
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const couponFeedback = useCartStore((state) => state.couponFeedback);
  const shippingCep = useCartStore((state) => state.shippingCep);
  const shippingQuote = useCartStore((state) => state.shippingQuote);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const clearCouponFeedback = useCartStore(
    (state) => state.clearCouponFeedback,
  );
  const setShippingCep = useCartStore((state) => state.setShippingCep);
  const calculateShipping = useCartStore((state) => state.calculateShipping);
  const selectShippingOption = useCartStore(
    (state) => state.selectShippingOption,
  );
  const saveForLater = useCartStore((state) => state.saveForLater);
  const totals = useCartTotals();

  if (items.length === 0) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb
          items={[{ label: 'Início', href: '/' }, { label: 'Carrinho' }]}
          className="mb-8"
        />
        <CartEmptyState />
      </Container>
    );
  }

  return (
    <>
      <Container className="py-8 pb-28 md:py-12 lg:pb-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <Breadcrumb
              items={[{ label: 'Início', href: '/' }, { label: 'Carrinho' }]}
            />
            <div>
              <p className="text-luxury text-muted-foreground mb-2">Sacola</p>
              <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
                Carrinho
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'itens'}{' '}
                selecionados
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Limpar carrinho
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <section aria-label="Itens do carrinho">
            {items.map((item) => (
              <CartPageItem
                key={item.lineId}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
                onSaveForLater={saveForLater}
              />
            ))}
          </section>

          <CartOrderSummary
            totals={totals}
            appliedCoupon={appliedCoupon}
            couponFeedback={couponFeedback}
            shippingCep={shippingCep}
            shippingQuote={shippingQuote}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onClearCouponFeedback={clearCouponFeedback}
            onShippingCepChange={setShippingCep}
            onCalculateShipping={calculateShipping}
            onSelectShippingOption={selectShippingOption}
          />
        </div>
      </Container>

      <CartMobileCheckoutBar totals={totals} />
    </>
  );
});
