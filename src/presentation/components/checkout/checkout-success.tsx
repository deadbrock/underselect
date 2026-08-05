'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import type { CheckoutOrderResult } from '@shared/types/checkout.types';

export interface CheckoutSuccessProps {
  order: CheckoutOrderResult;
}

export const CheckoutSuccess = memo(function CheckoutSuccess({
  order,
}: CheckoutSuccessProps) {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(order.total);

  const paymentLabels = {
    pix: 'PIX',
    card: 'Cartão de crédito',
    boleto: 'Boleto bancário',
  };

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2
          className="text-brand-bronze mx-auto size-16"
          strokeWidth={1.2}
          aria-hidden
        />
        <h1 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
          Pedido confirmado
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
          Sua compra foi registrada com sucesso. Em breve você receberá a
          confirmação por e-mail.
        </p>

        <dl className="border-border mt-8 space-y-3 border-t pt-8 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Número do pedido</dt>
            <dd className="font-mono font-medium">{order.orderId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Pagamento</dt>
            <dd>{paymentLabels[order.paymentMethod]}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-medium tabular-nums">{formattedTotal}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="bronze" size="lg" asChild>
            <Link href={'/categoria' as Route}>Continuar comprando</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={'/pedidos' as Route}>Ver pedidos</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
});
