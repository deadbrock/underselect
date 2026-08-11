'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { KpiGrid } from '@presentation/components/dashboard';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import {
  getCouponDiscount,
  getCouponRevenue,
} from '@presentation/stores/admin/marketing';
import type { CouponAttribution } from '@shared/types/marketing-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { CouponStatusBadge, CouponTypeBadge } from './marketing-status-badges';

export interface CouponDetailProps {
  couponId: string;
}

export const CouponDetail = memo(function CouponDetail({
  couponId,
}: CouponDetailProps) {
  const coupons = useMarketingStore((s) => s.coupons);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const influencers = useMarketingStore((s) => s.influencers);
  const allAttributions = useMarketingStore((s) => s.attributions);
  const toggleStatus = useMarketingStore((s) => s.toggleCouponStatus);

  const coupon = useMemo(
    () => coupons.find((c) => c.id === couponId),
    [coupons, couponId],
  );

  const influencer = useMemo(
    () =>
      coupon?.influencerId
        ? influencers.find((i) => i.id === coupon.influencerId)
        : undefined,
    [coupon, influencers],
  );

  const campaign = useMemo(
    () =>
      coupon?.campaignId
        ? campaigns.find((c) => c.id === coupon.campaignId)
        : undefined,
    [coupon, campaigns],
  );

  const attributions = useMemo(
    () => allAttributions.filter((a) => a.couponId === couponId),
    [allAttributions, couponId],
  );

  const stats = useMemo(() => {
    const revenue = getCouponRevenue(couponId, attributions);
    const discount = getCouponDiscount(couponId, attributions);
    return {
      orders: attributions.length,
      revenue,
      discount,
      avg: attributions.length > 0 ? revenue / attributions.length : 0,
    };
  }, [couponId, attributions]);

  if (!coupon) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Cupom não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/cupons">Voltar</Link>
        </Button>
      </div>
    );
  }

  const orderColumns: Column<CouponAttribution>[] = [
    { key: 'order', header: 'Pedido', cell: (a) => a.orderNumber },
    {
      key: 'customer',
      header: 'Cliente',
      cell: (a) => a.customerName,
      hideOnMobile: true,
    },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (a) => formatCurrency(a.attributedRevenue),
    },
    {
      key: 'discount',
      header: 'Desconto',
      cell: (a) => formatCurrency(a.discountAmount),
      hideOnMobile: true,
    },
    {
      key: 'date',
      header: 'Data',
      cell: (a) => formatDate(a.createdAt),
      hideOnMobile: true,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={coupon.code}
        description={coupon.name}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="min-h-10">
              <Link href={`/admin/marketing/cupons/${couponId}/editar`}>
                Editar
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => toggleStatus(couponId)}
            >
              {coupon.status === 'active' ? 'Pausar' : 'Ativar'}
            </Button>
          </div>
        }
      />

      <Card className="shadow-none">
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Tipo"
            value={<CouponTypeBadge type={coupon.discountType} />}
          />
          <Info
            label="Valor"
            value={
              coupon.discountType === 'percent'
                ? `${coupon.value}%`
                : formatCurrency(coupon.value)
            }
          />
          <Info
            label="Status"
            value={<CouponStatusBadge status={coupon.status} />}
          />
          <Info
            label="Validade"
            value={`${coupon.startDate} — ${coupon.endDate}`}
          />
          <Info
            label="Utilizações"
            value={`${coupon.usageCount}${coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}`}
          />
          <Info
            label="Limite/cliente"
            value={coupon.usageLimitPerCustomer ?? '—'}
          />
          <Info label="Influenciador" value={influencer?.name ?? '—'} />
          <Info label="Campanha" value={campaign?.name ?? '—'} />
          <Info label="Criado em" value={formatDate(coupon.createdAt)} />
        </CardContent>
      </Card>

      <KpiGrid
        columns={4}
        items={[
          { title: 'Pedidos', value: stats.orders },
          { title: 'Faturamento', value: formatCurrency(stats.revenue) },
          { title: 'Desconto', value: formatCurrency(stats.discount) },
          { title: 'Ticket médio', value: formatCurrency(stats.avg) },
        ]}
      />

      {Object.keys(coupon.rules).length > 0 && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Regras</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1">
              {coupon.rules.minOrderValue && (
                <li>
                  Valor mínimo: {formatCurrency(coupon.rules.minOrderValue)}
                </li>
              )}
              {coupon.rules.categorySlug && (
                <li>Categoria: {coupon.rules.categorySlug}</li>
              )}
              {coupon.rules.productId && (
                <li>Produto: {coupon.rules.productId}</li>
              )}
              {coupon.rules.firstPurchaseOnly && (
                <li>Apenas primeira compra</li>
              )}
              {coupon.rules.minQuantity && (
                <li>Quantidade mínima: {coupon.rules.minQuantity}</li>
              )}
              {coupon.rules.freeShipping && <li>Frete grátis</li>}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Pedidos atribuídos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={orderColumns}
            data={attributions}
            keyExtractor={(a) => a.id}
          />
        </CardContent>
      </Card>
    </div>
  );
});

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
