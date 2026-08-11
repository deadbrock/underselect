'use client';

import { Loader2 } from 'lucide-react';

import { memo, useEffect } from 'react';

import { Breadcrumb, Button } from '@presentation/components/ui';

import { Container } from '@presentation/components/layout';

import { Form, useAppForm } from '@presentation/components/forms';

import { toast } from '@presentation/hooks';

import { useCartStore, useCartTotals } from '@presentation/stores/cart';

import {
  checkoutDefaultValues,
  checkoutFormSchema,
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

  const isProcessing = useCheckoutStore((state) => state.isProcessing);

  const isRedirecting = useCheckoutStore((state) => state.isRedirecting);

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
      resetCheckout();
    };
  }, [resetCheckout]);

  if (isRedirecting) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <Loader2 className="text-brand-bronze size-12 animate-spin" />

        <h1 className="mt-6 text-2xl font-medium">
          Redirecionando para pagamento...
        </h1>

        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Aguarde enquanto abrimos o checkout seguro da InfinitePay.
        </p>
      </Container>
    );
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
      const selectedShipping = shippingQuote.options.find(
        (option) => option.id === shippingQuote.selectedOptionId,
      );

      await submitOrder({
        orderId: '',

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

        items: items.map((item) => ({
          productId: item.productId,

          variationId: item.modelId || undefined,

          slug: item.slug,

          sku: `${item.productId}-${item.size}-${item.colorId}`,

          name: item.name,

          imageUrl: item.imageUrl,

          quantity: item.quantity,

          unitPrice: item.price,

          size: item.size,

          colorLabel: item.colorLabel,

          modelLabel: item.modelLabel,

          categorySlug: item.category,
        })),

        shippingMethod: selectedShipping?.label,

        couponCode: appliedCoupon?.code,
      });

      clearCart();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível iniciar o pagamento. Tente novamente.',
      );
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
              Complete seus dados e pague com segurança na InfinitePay.
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

            <CheckoutPaymentMethods />

            <Button
              type="submit"

              variant="bronze"

              size="lg"

              className="hidden w-full lg:inline-flex"

              disabled={isProcessing}
            >
              {isProcessing ? 'Iniciando pagamento...' : 'Ir para pagamento'}
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
