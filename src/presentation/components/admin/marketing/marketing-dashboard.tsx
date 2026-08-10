'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';

import { KpiGrid } from '@presentation/components/dashboard';
import { DataTable, type Column } from '@presentation/components/data-display';
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
  getMarketingDashboardStats,
  getRevenueByInfluencerChart,
  getTopCouponsChart,
  getUsageChartData,
} from '@presentation/stores/admin/marketing/marketing.utils';
import type { CouponAttribution } from '@shared/types/marketing-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { MarketingBarChart } from './marketing-charts';

const recentColumns: Column<CouponAttribution>[] = [
  {
    key: 'order',
    header: 'Pedido',
    cell: (a) => (
      <div>
        <p className="font-medium">{a.orderNumber}</p>
        <p className="text-muted-foreground text-xs">{a.customerName}</p>
      </div>
    ),
  },
  {
    key: 'revenue',
    header: 'Faturamento',
    cell: (a) => (
      <span className="tabular-nums">
        {formatCurrency(a.attributedRevenue)}
      </span>
    ),
  },
  {
    key: 'discount',
    header: 'Desconto',
    cell: (a) => (
      <span className="text-destructive tabular-nums">
        -{formatCurrency(a.discountAmount)}
      </span>
    ),
    hideOnMobile: true,
  },
  {
    key: 'date',
    header: 'Data',
    cell: (a) => formatDate(a.createdAt),
    hideOnMobile: true,
  },
];

export const MarketingDashboard = memo(function MarketingDashboard() {
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const coupons = useMarketingStore((s) => s.coupons);
  const attributions = useMarketingStore((s) => s.attributions);

  const stats = useMemo(
    () =>
      getMarketingDashboardStats(influencers, campaigns, coupons, attributions),
    [influencers, campaigns, coupons, attributions],
  );

  const usageChart = useMemo(() => getUsageChartData(), []);
  const revenueChart = useMemo(
    () => getRevenueByInfluencerChart(influencers, attributions),
    [influencers, attributions],
  );
  const topCoupons = useMemo(() => getTopCouponsChart(coupons), [coupons]);
  const recent = useMemo(
    () =>
      [...attributions]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [attributions],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Marketing"
        description="Cupons, campanhas e influenciadores — performance e atribuição."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="min-h-10">
              <Link href="/admin/marketing/cupons/novo">Novo cupom</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="min-h-10">
              <Link href="/admin/marketing/influenciadores/novo">
                Novo influenciador
              </Link>
            </Button>
          </div>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { title: 'Cupons ativos', value: stats.activeCoupons },
          { title: 'Cupons utilizados', value: stats.usedCoupons },
          { title: 'Campanhas ativas', value: stats.activeCampaigns },
          { title: 'Influenciadores ativos', value: stats.activeInfluencers },
          {
            title: 'Pedidos c/ cupom',
            value: stats.ordersFromCoupons,
          },
          {
            title: 'Faturamento atribuído',
            value: formatCurrency(stats.attributedRevenue),
          },
          {
            title: 'Desconto concedido',
            value: formatCurrency(stats.totalDiscount),
          },
          {
            title: 'Ticket médio c/ cupom',
            value: formatCurrency(stats.averageTicketWithCoupon),
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MarketingBarChart
          title="Utilizações por período"
          description="Cupons aplicados — dados mockados."
          data={usageChart}
        />
        <MarketingBarChart
          title="Faturamento por influenciador"
          description="Receita atribuída."
          data={revenueChart}
        />
        <MarketingBarChart
          title="Top cupons"
          description="Mais utilizados."
          data={topCoupons}
        />
        <MarketingBarChart
          title="Desconto concedido"
          description="Por mês — mock."
          data={usageChart.map((d) => ({
            ...d,
            value: Math.round(d.value * 12.5),
          }))}
        />
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">
            Pedidos atribuídos recentes
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/marketing/relatorios/influenciadores">
              Ver relatório
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={recentColumns}
            data={recent}
            keyExtractor={(a) => a.id}
          />
        </CardContent>
      </Card>
    </div>
  );
});
