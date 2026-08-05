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
import { PageHeader } from '@presentation/components/layout';
import {
  ADMIN_PAYMENT_METHOD_LABELS,
  ADMIN_PAYMENT_STATUS_LABELS,
  ADMIN_SHIPPING_CARRIER_LABELS,
  ADMIN_SHIPPING_STATUS_LABELS,
} from '@shared/constants/order-admin.constants';
import type { AdminOrder } from '@shared/types/order-admin.types';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from '@shared/utils/format';

import { OrderActions } from './order-actions';
import { OrderHistoryList } from './order-history';
import { OrderNoteForm } from './order-note-form';
import { OrderStatusBadge } from './order-status-badge';
import { OrderStatusForm } from './order-status-form';
import { OrderTimeline } from './order-timeline';

export interface OrderDetailProps {
  order: AdminOrder;
}

export const OrderDetail = memo(function OrderDetail({
  order,
}: OrderDetailProps) {
  const address = order.shippingAddress;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Pedido ${order.number}`}
        description={`${formatDateTime(order.createdAt)} · ${order.customer.name}`}
        actions={<OrderStatusBadge status={order.status} />}
      />

      <OrderActions order={order} />

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section aria-label="Produtos">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Produtos
            </h2>
            <ul className="divide-border divide-y rounded-md border">
              {order.items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.sku}`}
                  className="flex gap-4 p-4"
                >
                  <div className="bg-muted relative size-20 shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={`/produto/${item.slug}` as Route}
                      className="hover:text-brand-bronze line-clamp-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground font-mono text-xs">
                      {item.sku}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.colorLabel} · Tam. {item.size} · Qtd.{' '}
                      {item.quantity}
                    </p>
                    <Price value={item.totalPrice} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Cliente">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Cliente
            </h2>
            <Card className="shadow-none">
              <CardContent className="grid gap-3 p-4 text-sm sm:grid-cols-2">
                <Info label="Nome" value={order.customer.name} />
                <Info label="CPF" value={order.customer.cpf} />
                <Info label="E-mail" value={order.customer.email} />
                <Info label="Telefone" value={order.customer.phone} />
                <Info
                  label="Compras"
                  value={String(order.customer.totalOrders)}
                />
                <Info
                  label="Total gasto"
                  value={formatCurrency(order.customer.totalSpent)}
                />
              </CardContent>
            </Card>
          </section>

          <section aria-label="Histórico" className="xl:hidden">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Histórico
            </h2>
            <Card className="shadow-none">
              <CardContent className="p-4">
                <OrderHistoryList entries={order.history} />
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Row label="Frete" value={formatCurrency(order.shipping)} />
              {order.discount > 0 && (
                <Row
                  label="Desconto"
                  value={`-${formatCurrency(order.discount)}`}
                  className="text-green-700 dark:text-green-400"
                />
              )}
              <Separator />
              <Row label="Total" value={formatCurrency(order.total)} bold />
              {order.couponCode && (
                <p className="text-muted-foreground text-xs">
                  Cupom: <Badge variant="outline">{order.couponCode}</Badge>
                </p>
              )}
              {order.influencerCode && (
                <p className="text-muted-foreground text-xs">
                  Influenciador: {order.influencerName} ({order.influencerCode})
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Info
                label="Forma"
                value={ADMIN_PAYMENT_METHOD_LABELS[order.payment.method]}
              />
              <Info
                label="Status"
                value={ADMIN_PAYMENT_STATUS_LABELS[order.payment.status]}
              />
              {order.payment.installments && order.payment.installments > 1 && (
                <Info
                  label="Parcelamento"
                  value={`${order.payment.installments}x`}
                />
              )}
              {order.payment.transactionId && (
                <Info label="Transação" value={order.payment.transactionId} />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Info
                label="Transportadora"
                value={
                  ADMIN_SHIPPING_CARRIER_LABELS[order.shippingInfo.carrier]
                }
              />
              <Info label="Modalidade" value={order.shippingInfo.method} />
              <Info
                label="Status"
                value={ADMIN_SHIPPING_STATUS_LABELS[order.shippingInfo.status]}
              />
              {order.shippingInfo.trackingCode && (
                <Info
                  label="Rastreio"
                  value={order.shippingInfo.trackingCode}
                />
              )}
              {order.shippingInfo.estimatedDelivery && (
                <Info
                  label="Previsão"
                  value={formatDate(order.shippingInfo.estimatedDelivery)}
                />
              )}
              <Separator className="my-2" />
              <p className="text-foreground font-medium">{address.label}</p>
              <p className="text-muted-foreground">
                {address.street}, {address.number}
                {address.complement ? ` — ${address.complement}` : ''}
              </p>
              <p className="text-muted-foreground">
                {address.neighborhood} — {address.city}/{address.state}
              </p>
              <p className="text-muted-foreground">CEP {address.cep}</p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={order.timeline} compact />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="space-y-4 p-4">
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
              />
              <OrderNoteForm orderId={order.id} />
            </CardContent>
          </Card>

          {order.internalNotes.length > 0 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Observações internas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {order.internalNotes.map((note, i) => (
                    <li key={i} className="text-muted-foreground">
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <section aria-label="Histórico" className="hidden xl:block">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderHistoryList entries={order.history} />
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>
    </div>
  );
});

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between ${className ?? ''}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? 'font-medium tabular-nums' : 'tabular-nums'}>
        {value}
      </span>
    </div>
  );
}
