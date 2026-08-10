'use client';

import { memo, useMemo } from 'react';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useCustomerStore } from '@presentation/stores/admin/customer';
import { useOrderStore } from '@presentation/stores/admin/order';
import { ADMIN_CUSTOMER_SEGMENT_LABELS } from '@shared/constants/customer-admin.constants';
import type { AdminCustomer } from '@shared/types/customer-admin.types';
import {
  formatCurrency,
  formatDate,
  formatPhone,
  maskCpf,
} from '@shared/utils/format';

import { CustomerActions } from './customer-actions';
import { CustomerActivityTimeline } from './customer-activity';
import { CustomerAddresses } from './customer-addresses';
import { CustomerCoupons } from './customer-coupons';
import { CustomerNoteForm } from './customer-note-form';
import { CustomerOrders } from './customer-orders';
import { CustomerStatsCards } from './customer-stats-cards';
import { CustomerStatusBadge } from './customer-status-badge';
import { CustomerTypeBadge } from './customer-type-badge';

export interface CustomerDetailProps {
  customer: AdminCustomer;
}

export const CustomerDetail = memo(function CustomerDetail({
  customer,
}: CustomerDetailProps) {
  const orders = useOrderStore((s) => s.orders);
  const getCouponUsagesByCustomer = useCustomerStore(
    (s) => s.getCouponUsagesByCustomer,
  );
  const getActivitiesByCustomer = useCustomerStore(
    (s) => s.getActivitiesByCustomer,
  );

  const customerOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customer.id === customer.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [orders, customer.id],
  );

  const couponUsages = getCouponUsagesByCustomer(customer.id);
  const activities = getActivitiesByCustomer(customer.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title={customer.name}
        description={`${customer.email} · Cadastro ${formatDate(customer.createdAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <CustomerTypeBadge type={customer.type} />
            <CustomerStatusBadge status={customer.status} />
          </div>
        }
      />

      <CustomerActions customer={customer} />

      <section aria-label="Resumo comercial">
        <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
          Resumo comercial
        </h2>
        <CustomerStatsCards customer={customer} />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Perfil</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="E-mail" value={customer.email} />
              <Info label="Telefone" value={formatPhone(customer.phone)} />
              <Info label="CPF" value={maskCpf(customer.cpf)} />
              <Info label="Cadastro" value={formatDate(customer.createdAt)} />
              <Info label="Pedidos" value={String(customer.orderCount)} />
              <Info
                label="Total comprado"
                value={formatCurrency(customer.totalSpent)}
              />
              <Info
                label="Ticket médio"
                value={formatCurrency(customer.averageTicket)}
              />
              <Info
                label="Primeira compra"
                value={formatDate(customer.firstPurchaseAt ?? '')}
              />
              <Info
                label="Última compra"
                value={formatDate(customer.lastPurchaseAt ?? '')}
              />
              {customer.influencerOrigin && (
                <Info
                  label="Origem influenciador"
                  value={customer.influencerOrigin}
                />
              )}
            </CardContent>
          </Card>

          <section id="pedidos" aria-label="Histórico de pedidos">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Pedidos
            </h2>
            <CustomerOrders orders={customerOrders} />
          </section>

          <section aria-label="Cupons utilizados">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Cupons utilizados
            </h2>
            <CustomerCoupons usages={couponUsages} />
          </section>

          <section aria-label="Endereços">
            <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
              Endereços
            </h2>
            <CustomerAddresses
              customerId={customer.id}
              addresses={customer.addresses}
            />
          </section>
        </div>

        <aside className="space-y-6">
          {customer.segments.length > 0 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Segmentação
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {customer.segments.map((seg) => (
                  <Badge key={seg} variant="outline">
                    {ADMIN_CUSTOMER_SEGMENT_LABELS[seg]}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerActivityTimeline activities={activities} />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-4">
              <CustomerNoteForm customerId={customer.id} />
            </CardContent>
          </Card>

          {customer.internalNotes.length > 0 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {customer.internalNotes.map((note, i) => (
                    <li key={i} className="text-muted-foreground">
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
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
