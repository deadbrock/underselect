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
import { getInfluencerPerformanceChart } from '@presentation/stores/admin/marketing/marketing.utils';
import type {
  AdminCampaign,
  AdminCoupon,
  CouponAttribution,
} from '@shared/types/marketing-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { MarketingBarChart } from './marketing-charts';
import { CampaignStatusBadge } from './marketing-status-badges';
import { CouponStatusBadge } from './marketing-status-badges';
import { InfluencerStatusBadge } from './marketing-status-badges';

export interface InfluencerDetailProps {
  influencerId: string;
}

export const InfluencerDetail = memo(function InfluencerDetail({
  influencerId,
}: InfluencerDetailProps) {
  const influencer = useMarketingStore((s) =>
    s.getInfluencerById(influencerId),
  );
  const metrics = useMarketingStore((s) =>
    s.getInfluencerMetrics(influencerId),
  );
  const campaigns = useMarketingStore((s) =>
    s.getCampaignsByInfluencer(influencerId),
  );
  const coupons = useMarketingStore((s) =>
    s.getCouponsByInfluencer(influencerId),
  );
  const attributions = useMarketingStore((s) =>
    s.getAttributionsByInfluencer(influencerId),
  );
  const toggleStatus = useMarketingStore((s) => s.toggleInfluencerStatus);

  const perfChart = useMemo(
    () => getInfluencerPerformanceChart(influencerId, attributions),
    [influencerId, attributions],
  );

  if (!influencer || !metrics) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Influenciador não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/influenciadores">Voltar</Link>
        </Button>
      </div>
    );
  }

  const avgTicket =
    metrics.orderCount > 0 ? metrics.attributedRevenue / metrics.orderCount : 0;

  const orderColumns: Column<CouponAttribution>[] = [
    {
      key: 'order',
      header: 'Pedido',
      cell: (a) => a.orderNumber,
    },
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
        title={influencer.name}
        description={`${influencer.identifierCode} · ${influencer.username}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="min-h-10">
              <Link
                href={`/admin/marketing/influenciadores/${influencerId}/editar`}
              >
                Editar
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => toggleStatus(influencerId)}
            >
              {influencer.status === 'active' ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        }
      />

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="E-mail" value={influencer.email} />
          <Info label="Telefone" value={influencer.phone} />
          <Info label="Instagram" value={influencer.instagram ?? '—'} />
          <Info label="TikTok" value={influencer.tiktok ?? '—'} />
          <Info label="YouTube" value={influencer.youtube ?? '—'} />
          <Info
            label="Status"
            value={<InfluencerStatusBadge status={influencer.status} />}
          />
          {influencer.notes && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Info label="Observações" value={influencer.notes} />
            </div>
          )}
        </CardContent>
      </Card>

      <KpiGrid
        columns={4}
        items={[
          { title: 'Campanhas', value: metrics.campaignCount },
          { title: 'Cupons', value: metrics.couponCount },
          { title: 'Utilizações', value: metrics.usageCount },
          { title: 'Pedidos', value: metrics.orderCount },
          {
            title: 'Faturamento',
            value: formatCurrency(metrics.attributedRevenue),
          },
          {
            title: 'Descontos',
            value: formatCurrency(metrics.discountGenerated),
          },
          { title: 'Ticket médio', value: formatCurrency(avgTicket) },
        ]}
      />

      <MarketingBarChart
        title="Performance ao longo do tempo"
        description="Faturamento atribuído — mock."
        data={perfChart}
      />

      <Section title="Campanhas" items={campaigns} type="campaign" />
      <Section title="Cupons" items={coupons} type="coupon" />

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

function Section({
  title,
  items,
  type,
}: {
  title: string;
  items: AdminCampaign[] | AdminCoupon[];
  type: 'campaign' | 'coupon';
}) {
  if (items.length === 0) return null;
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => {
          const isCampaign = type === 'campaign';
          const campaign = item as AdminCampaign;
          const coupon = item as AdminCoupon;
          return (
            <div
              key={item.id}
              className="border-border flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {isCampaign ? campaign.name : coupon.code}
                </p>
                <p className="text-muted-foreground text-xs">
                  {isCampaign
                    ? `${campaign.startDate} — ${campaign.endDate}`
                    : coupon.name}
                </p>
              </div>
              {isCampaign ? (
                <CampaignStatusBadge status={campaign.status} />
              ) : (
                <CouponStatusBadge status={coupon.status} />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
