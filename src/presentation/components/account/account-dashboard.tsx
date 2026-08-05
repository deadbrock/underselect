'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { KpiGrid } from '@presentation/components/dashboard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import {
  getDashboardStats,
  getProductsByIds,
  MOCK_ACCOUNT_COUPONS,
  MOCK_ACCOUNT_ORDERS,
  MOCK_RECENTLY_VIEWED_IDS,
} from '@shared/mocks/account.data';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@shared/constants/account.constants';
import { useAccountStore } from '@presentation/stores/account';
import { formatCurrency } from '@shared/utils/format';

import { AccountPageHeader } from './account-page-header';
import { AccountProductSection } from './account-product-section';

export const AccountDashboard = memo(function AccountDashboard() {
  const user = useAccountStore((s) => s.user);
  const favoriteIds = useAccountStore((s) => s.favoriteIds);
  const stats = getDashboardStats(favoriteIds.length);
  const lastOrder = MOCK_ACCOUNT_ORDERS[0];
  const favorites = getProductsByIds(favoriteIds.slice(0, 4));
  const recentlyViewed = getProductsByIds(MOCK_RECENTLY_VIEWED_IDS.slice(0, 4));
  const availableCoupons = MOCK_ACCOUNT_COUPONS.filter(
    (c) => c.status === 'available',
  );

  return (
    <div className="space-y-10">
      <AccountPageHeader
        title={`Olá, ${user.firstName}`}
        description="Bem-vindo à sua área premium UNDER SELECT. Acompanhe pedidos, favoritos e benefícios."
      />

      <KpiGrid
        items={[
          { title: 'Pedidos', value: stats.totalOrders },
          { title: 'Total gasto', value: formatCurrency(stats.totalSpent) },
          { title: 'Favoritos', value: stats.favoriteCount },
          { title: 'Cupons', value: stats.availableCoupons },
        ]}
      />

      {lastOrder && (
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Último pedido
            </CardTitle>
            <Link
              href={`/pedidos/${lastOrder.id}` as Route}
              className="text-label text-brand-bronze hover:underline"
            >
              Ver detalhes
            </Link>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Número</span>
              <p className="font-mono">{lastOrder.number}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status</span>
              <p>{ORDER_STATUS_LABELS[lastOrder.status]}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Pagamento</span>
              <p>{PAYMENT_METHOD_LABELS[lastOrder.paymentMethod]}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total</span>
              <p className="font-medium tabular-nums">
                {formatCurrency(lastOrder.total)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {availableCoupons.length > 0 && (
        <section aria-label="Cupons disponíveis">
          <h2 className="mb-4 text-lg font-medium tracking-tight">
            Cupons disponíveis
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {availableCoupons.map((coupon) => (
              <Card key={coupon.code} className="shadow-none">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {coupon.code}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {coupon.label}
                    </p>
                  </div>
                  {coupon.expiresAt && (
                    <span className="text-muted-foreground text-xs">
                      até{' '}
                      {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <AccountProductSection
        title="Favoritos"
        products={favorites}
        emptyMessage="Nenhum favorito ainda."
        href="/favoritos"
      />

      <AccountProductSection
        title="Visualizados recentemente"
        products={recentlyViewed}
        emptyMessage="Nenhum produto visualizado."
      />
    </div>
  );
});
