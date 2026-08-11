'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Loader2 } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import {
  checkInfinitePayPaymentApi,
  fetchOrderPaymentStatusApi,
} from '@presentation/stores/payments/payments.api';
import { useCartStore } from '@presentation/stores/cart';
import { useCheckoutStore } from '@presentation/stores/checkout';

type ReturnState = 'loading' | 'approved' | 'pending' | 'failed';

export const CheckoutReturnExperience = memo(
  function CheckoutReturnExperience() {
    const searchParams = useSearchParams();
    const clearCart = useCartStore((state) => state.clearCart);
    const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

    const orderNsu = searchParams.get('order_nsu') ?? '';
    const transactionNsu = searchParams.get('transaction_nsu') ?? '';
    const slug = searchParams.get('slug') ?? '';
    const receiptUrl = searchParams.get('receipt_url');

    const [state, setState] = useState<ReturnState>('loading');
    const [orderTotal, setOrderTotal] = useState<number | null>(null);
    const [resolvedReceiptUrl, setResolvedReceiptUrl] = useState<string | null>(
      receiptUrl,
    );

    useEffect(() => {
      clearCart();
      resetCheckout();
    }, [clearCart, resetCheckout]);

    useEffect(() => {
      let cancelled = false;

      async function resolvePayment() {
        if (!orderNsu) {
          setState('failed');
          return;
        }

        try {
          if (transactionNsu && slug) {
            const result = await checkInfinitePayPaymentApi({
              orderNsu,
              transactionNsu,
              slug,
            });

            if (cancelled) return;

            setOrderTotal(result.order?.total ?? null);
            setResolvedReceiptUrl(result.order?.receiptUrl ?? receiptUrl);

            if (result.paid && result.paymentStatus === 'approved') {
              setState('approved');
              return;
            }
          }

          const status = await fetchOrderPaymentStatusApi(orderNsu);
          if (cancelled) return;

          setOrderTotal(status.total);
          setResolvedReceiptUrl(status.receiptUrl ?? receiptUrl);

          if (status.paymentStatus === 'approved') {
            setState('approved');
          } else if (status.paymentStatus === 'pending') {
            setState('pending');
          } else {
            setState('failed');
          }
        } catch {
          if (!cancelled) setState('failed');
        }
      }

      void resolvePayment();

      return () => {
        cancelled = true;
      };
    }, [orderNsu, transactionNsu, slug, receiptUrl]);

    const title = useMemo(() => {
      switch (state) {
        case 'approved':
          return 'Pagamento confirmado';
        case 'pending':
          return 'Pagamento em análise';
        case 'failed':
          return 'Pagamento não confirmado';
        default:
          return 'Verificando pagamento...';
      }
    }, [state]);

    const description = useMemo(() => {
      switch (state) {
        case 'approved':
          return 'Recebemos a confirmação do pagamento. Em breve você receberá a confirmação por e-mail.';
        case 'pending':
          return 'Seu pagamento ainda está sendo processado. Assim que for confirmado, atualizaremos o pedido.';
        case 'failed':
          return 'Não foi possível confirmar o pagamento. Você pode tentar novamente ou entrar em contato conosco.';
        default:
          return 'Estamos consultando o status real do pagamento. Aguarde um instante.';
      }
    }, [state]);

    return (
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-lg text-center">
          {state === 'loading' ? (
            <Loader2 className="text-brand-bronze mx-auto size-12 animate-spin" />
          ) : null}

          <h1 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
            {description}
          </p>

          {orderNsu ? (
            <dl className="border-border mt-8 space-y-3 border-t pt-8 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Número do pedido</dt>
                <dd className="font-mono font-medium">{orderNsu}</dd>
              </div>
              {orderTotal !== null ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-medium tabular-nums">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(orderTotal)}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {resolvedReceiptUrl ? (
              <Button variant="outline" size="lg" asChild>
                <a href={resolvedReceiptUrl} target="_blank" rel="noreferrer">
                  Ver comprovante
                </a>
              </Button>
            ) : null}
            <Button variant="bronze" size="lg" asChild>
              <Link href={'/categoria' as Route}>Continuar comprando</Link>
            </Button>
            {state !== 'approved' ? (
              <Button variant="outline" size="lg" asChild>
                <Link href={'/checkout' as Route}>Tentar novamente</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    );
  },
);
