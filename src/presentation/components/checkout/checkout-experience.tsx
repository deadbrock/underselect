'use client';

import { memo, useEffect } from 'react';

import { Breadcrumb, Button } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import { Form, useAppForm } from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import { useCartStore, useCartTotals } from '@presentation/stores/cart';
import {
  checkoutDefaultValues,
  checkoutFormSchema,
  generateOrderId,
  useCheckoutStore,
  type CheckoutFormSchema,
} from '@presentation/stores/checkout';

import { CartEmptyState } from './cart-empty-state';
import { CheckoutAddressForm } from './checkout-address-form';
import { CheckoutCustomerForm } from './checkout-customer-form';
import { CheckoutMobileBar } from './checkout-mobile-bar';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import { CheckoutShippingOptions } from './checkout-shipping-options';
import { CheckoutSuccess } from './checkout-success';

export const CheckoutExperience = memo(function CheckoutExperience() {
  const items = useCartStore((state) => state.items);
  const shippingQuote = useCartStore((state) => state.shippingQuote);
  const shippingCep = useCartStore((state) => state.shippingCep);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const couponFeedback = useCartStore((state) => state.couponFeedback);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const clearCouponFeedback = useCartStore(
    (state) => state.clearCouponFeedback,
  );
  const clearCart = useCartStore((state) => state.clearCart);

  const orderResult = useCheckoutStore((state) => state.orderResult);
  const isProcessing = useCheckoutStore((state) => state.isProcessing);
  const submitOrder = useCheckoutStore((state) => state.submitOrder);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const totals = useCartTotals();

  const form = useAppForm(checkoutFormSchema, {
    defaultValues: {
      ...checkoutDefaultValues,
      cep: shippingCep,
    },
  });

  useEffect(() => {
    return () => {
      if (!useCheckoutStore.getState().orderResult) {
        resetCheckout();
      }
    };
  }, [resetCheckout]);

  if (orderResult) {
    return <CheckoutSuccess order={orderResult} />;
  }

  if (items.length === 0) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Carrinho', href: '/carrinho' },
            { label: 'Checkout' },
          ]}
          className="mb-8"
        />
        <CartEmptyState />
      </Container>
    );
  }

  const handleSubmit = async (values: CheckoutFormSchema) => {
    if (!shippingQuote) {
      toast.error('Consulte o CEP para calcular o frete antes de finalizar.');
      form.setFocus('cep');
      return;
    }

    try {
      const orderId = generateOrderId();

      await submitOrder({
        orderId,
        amount: totals.total,
        currency: 'BRL',
        paymentMethod: values.paymentMethod,
        installments:
          values.paymentMethod === 'card' ? values.cardInstallments : undefined,
        customer: {
          firstName: values.firstName,
          lastName: values.lastName,
          cpf: values.cpf,
          email: values.email,
          phone: values.phone,
          createAccount: values.createAccount,
        },
        address: {
          cep: values.cep,
          street: values.street,
          number: values.number,
          complement: values.complement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          reference: values.reference,
        },
      });

      clearCart();
      toast.success('Pedido realizado com sucesso!');
    } catch {
      toast.error('Não foi possível finalizar o pedido. Tente novamente.');
    }
  };

  return (
    <>
      <Container className="py-8 pb-28 md:py-12 lg:pb-12">
        <div className="mb-8 space-y-4">
          <Breadcrumb
            items={[
              { label: 'Início', href: '/' },
              { label: 'Carrinho', href: '/carrinho' },
              { label: 'Checkout' },
            ]}
          />
          <div>
            <p className="text-luxury text-muted-foreground mb-2">Checkout</p>
            <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
              Finalizar compra
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Complete seus dados em uma única etapa — rápido e seguro.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <Form
            form={form}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-10"
          >
            <CheckoutCustomerForm />
            <CheckoutAddressForm />
            <CheckoutShippingOptions />
            <CheckoutPaymentMethods maxInstallments={totals.installmentCount} />

            <Button
              type="submit"
              variant="bronze"
              size="lg"
              className="hidden w-full lg:inline-flex"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Finalizar compra'}
            </Button>
          </Form>

          <CheckoutOrderSummary
            items={items}
            totals={totals}
            appliedCoupon={appliedCoupon}
            couponFeedback={couponFeedback}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onClearCouponFeedback={clearCouponFeedback}
          />
        </div>
      </Container>

      <CheckoutMobileBar
        totals={totals}
        isProcessing={isProcessing}
        onSubmit={form.handleSubmit(handleSubmit)}
      />
    </>
  );
});
