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
import type { CouponAttribution } from '@shared/types/marketing-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { MarketingBarChart } from './marketing-charts';
import {
  CampaignStatusBadge,
  CouponStatusBadge,
} from './marketing-status-badges';

export interface CampaignDetailProps {
  campaignId: string;
}

export const CampaignDetail = memo(function CampaignDetail({
  campaignId,
}: CampaignDetailProps) {
  const campaign = useMarketingStore((s) => s.getCampaignById(campaignId));
  const influencer = useMarketingStore((s) =>
    campaign ? s.getInfluencerById(campaign.influencerId) : undefined,
  );
  const coupons = useMarketingStore((s) => s.getCouponsByCampaign(campaignId));
  const attributions = useMarketingStore((s) =>
    s.getAttributionsByCampaign(campaignId),
  );
  const toggleStatus = useMarketingStore((s) => s.toggleCampaignStatus);

  const stats = useMemo(() => {
    const revenue = attributions.reduce((s, a) => s + a.attributedRevenue, 0);
    const discount = attributions.reduce((s, a) => s + a.discountAmount, 0);
    return {
      orders: attributions.length,
      revenue,
      discount,
      avg: attributions.length > 0 ? revenue / attributions.length : 0,
    };
  }, [attributions]);

  const chartData = useMemo(
    () =>
      coupons.map((c) => ({
        label: c.code,
        value: c.usageCount,
      })),
    [coupons],
  );

  if (!campaign) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Campanha não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/campanhas">Voltar</Link>
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
      key: 'date',
      header: 'Data',
      cell: (a) => formatDate(a.createdAt),
      hideOnMobile: true,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={campaign.name}
        description={campaign.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="min-h-10">
              <Link href={`/admin/marketing/campanhas/${campaignId}/editar`}>
                Editar
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => toggleStatus(campaignId)}
            >
              {campaign.status === 'active' ? 'Pausar' : 'Ativar'}
            </Button>
          </div>
        }
      />

      <Card className="shadow-none">
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Influenciador" value={influencer?.name ?? '—'} />
          <Info
            label="Período"
            value={`${campaign.startDate} — ${campaign.endDate}`}
          />
          <Info
            label="Status"
            value={<CampaignStatusBadge status={campaign.status} />}
          />
          <Info label="Objetivo" value={campaign.objective || '—'} />
          <Info
            label="Meta vendas"
            value={
              campaign.salesGoal ? formatCurrency(campaign.salesGoal) : '—'
            }
          />
          <Info label="Meta pedidos" value={campaign.ordersGoal ?? '—'} />
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

      <MarketingBarChart title="Utilizações por cupom" data={chartData} />

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Cupons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="border-border flex items-center justify-between rounded-md border p-3"
            >
              <Link
                href={`/admin/marketing/cupons/${c.id}`}
                className="font-medium hover:underline"
              >
                {c.code}
              </Link>
              <CouponStatusBadge status={c.status} />
            </div>
          ))}
        </CardContent>
      </Card>

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
