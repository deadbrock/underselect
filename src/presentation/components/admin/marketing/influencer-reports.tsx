'use client';

import { memo, useMemo, useState } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { KpiGrid } from '@presentation/components/dashboard';
import {
  Card,
  CardContent,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import {
  computeInfluencerMetrics,
  filterAttributions,
  getTopInfluencersChart,
} from '@presentation/stores/admin/marketing';
import type { ReportFilters } from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { MarketingBarChart } from './marketing-charts';

const DEFAULT: ReportFilters = {
  search: '',
  influencerId: 'all',
  campaignId: 'all',
  couponId: 'all',
  status: 'all',
};

interface ReportRow {
  id: string;
  influencer: string;
  campaign: string;
  coupon: string;
  usage: number;
  orders: number;
  revenue: number;
  discount: number;
  avgTicket: number;
  conversionRate: string;
}

export const InfluencerReports = memo(function InfluencerReports() {
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const coupons = useMarketingStore((s) => s.coupons);
  const attributions = useMarketingStore((s) => s.attributions);
  const getCampaign = useMarketingStore((s) => s.getCampaignById);
  const getCoupon = useMarketingStore((s) => s.getCouponById);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT);

  const filteredAttrs = useMemo(
    () => filterAttributions(attributions, filters),
    [attributions, filters],
  );

  const rows = useMemo((): ReportRow[] => {
    return filteredAttrs.map((a) => {
      const coupon = getCoupon(a.couponId);
      const inf = influencers.find((i) => i.id === a.influencerId);
      const camp = a.campaignId ? getCampaign(a.campaignId) : undefined;
      return {
        id: a.id,
        influencer: inf?.name ?? '—',
        campaign: camp?.name ?? '—',
        coupon: coupon?.code ?? '—',
        usage: coupon?.usageCount ?? 0,
        orders: 1,
        revenue: a.attributedRevenue,
        discount: a.discountAmount,
        avgTicket: a.attributedRevenue,
        conversionRate: '—',
      };
    });
  }, [filteredAttrs, influencers, getCoupon, getCampaign]);

  const metrics = useMemo(() => {
    return influencers.map((inf) =>
      computeInfluencerMetrics(inf.id, campaigns, coupons, attributions, inf),
    );
  }, [influencers, campaigns, coupons, attributions]);

  const chartData = useMemo(() => getTopInfluencersChart(metrics), [metrics]);

  const totals = useMemo(() => {
    const revenue = filteredAttrs.reduce((s, a) => s + a.attributedRevenue, 0);
    const discount = filteredAttrs.reduce((s, a) => s + a.discountAmount, 0);
    return {
      orders: filteredAttrs.length,
      revenue,
      discount,
      avg: filteredAttrs.length > 0 ? revenue / filteredAttrs.length : 0,
    };
  }, [filteredAttrs]);

  const columns: Column<ReportRow>[] = [
    { key: 'influencer', header: 'Influenciador', cell: (r) => r.influencer },
    {
      key: 'campaign',
      header: 'Campanha',
      cell: (r) => r.campaign,
      hideOnMobile: true,
    },
    {
      key: 'coupon',
      header: 'Cupom',
      cell: (r) => <span className="font-mono">{r.coupon}</span>,
    },
    { key: 'orders', header: 'Pedidos', cell: (r) => r.orders },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (r) => formatCurrency(r.revenue),
    },
    {
      key: 'discount',
      header: 'Desconto',
      cell: (r) => formatCurrency(r.discount),
      hideOnMobile: true,
    },
    {
      key: 'avg',
      header: 'Ticket médio',
      cell: (r) => formatCurrency(r.avgTicket),
      hideOnMobile: true,
    },
    {
      key: 'conv',
      header: 'Conversão',
      cell: (r) => r.conversionRate,
      hideOnMobile: true,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatório de Influenciadores"
        description="Atribuição, faturamento e performance — dados mockados."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label="Influenciador"
          value={filters.influencerId}
          onChange={(v) => setFilters((p) => ({ ...p, influencerId: v }))}
          options={[
            { value: 'all', label: 'Todos' },
            ...influencers.map((i) => ({ value: i.id, label: i.name })),
          ]}
        />
        <FilterSelect
          label="Campanha"
          value={filters.campaignId}
          onChange={(v) => setFilters((p) => ({ ...p, campaignId: v }))}
          options={[
            { value: 'all', label: 'Todas' },
            ...campaigns.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <FilterSelect
          label="Cupom"
          value={filters.couponId}
          onChange={(v) => setFilters((p) => ({ ...p, couponId: v }))}
          options={[
            { value: 'all', label: 'Todos' },
            ...coupons.map((c) => ({ value: c.id, label: c.code })),
          ]}
        />
      </div>
      <KpiGrid
        columns={4}
        items={[
          { title: 'Pedidos', value: totals.orders },
          { title: 'Faturamento', value: formatCurrency(totals.revenue) },
          { title: 'Desconto', value: formatCurrency(totals.discount) },
          { title: 'Ticket médio', value: formatCurrency(totals.avg) },
        ]}
      />
      <MarketingBarChart title="Top influenciadores" data={chartData} />
      <Card className="shadow-none">
        <CardContent className="p-0">
          <DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />
        </CardContent>
      </Card>
    </div>
  );
});

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
