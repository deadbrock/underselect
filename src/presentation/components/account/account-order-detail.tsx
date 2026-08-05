'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Price } from '@presentation/components/data-display';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from '@presentation/components/ui';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@shared/constants/account.constants';
import type { AccountOrder } from '@shared/types/account.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { AccountOrderTimeline } from './account-order-timeline';
import { AccountPageHeader } from './account-page-header';

export interface AccountOrderDetailProps {
  order: AccountOrder;
}

export const AccountOrderDetail = memo(function AccountOrderDetail({
  order,
}: AccountOrderDetailProps) {
  const address = order.shippingAddress;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title={`Pedido ${order.number}`}
        description={`Realizado em ${formatDate(order.createdAt)} · ${ORDER_STATUS_LABELS[order.status]}`}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section aria-label="Produtos do pedido" className="space-y-4">
          <h2 className="text-sm font-medium tracking-wide uppercase">
            Produtos
          </h2>
          <ul className="divide-border divide-y rounded-md border">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 p-4"
              >
                <Link
                  href={`/produto/${item.slug}` as Route}
                  className="bg-muted relative size-20 shrink-0 overflow-hidden"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/produto/${item.slug}` as Route}
                    className="hover:text-brand-bronze line-clamp-2 text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground text-xs">
                    {item.colorLabel} · Tam. {item.size} · Qtd. {item.quantity}
                  </p>
                  <Price value={item.price * item.quantity} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="tabular-nums">
                  {formatCurrency(order.shipping)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700 dark:text-green-400">
                  <span>Desconto</span>
                  <span className="tabular-nums">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground text-xs">Pagamento</span>
                <p>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Endereço de entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-1 text-sm">
              <p className="text-foreground font-medium">{address.label}</p>
              <p>
                {address.street}, {address.number}
                {address.complement ? ` — ${address.complement}` : ''}
              </p>
              <p>
                {address.neighborhood} — {address.city}/{address.state}
              </p>
              <p>CEP {address.cep}</p>
            </CardContent>
          </Card>

          {order.trackingCode && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Rastreamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="font-mono">
                  {order.trackingCode}
                </Badge>
                <p className="text-muted-foreground mt-2 text-xs">
                  Integração com transportadora preparada para a próxima fase.
                </p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <section aria-label="Timeline do pedido">
        <h2 className="mb-6 text-sm font-medium tracking-wide uppercase">
          Acompanhamento
        </h2>
        <AccountOrderTimeline events={order.timeline} />
      </section>
    </div>
  );
});
