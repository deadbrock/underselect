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
  filterAttributions,
  getCouponDiscount,
  getCouponRevenue,
} from '@presentation/stores/admin/marketing';
import type {
  AdminCoupon,
  ReportFilters,
} from '@shared/types/marketing-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { CouponStatusBadge, CouponTypeBadge } from './marketing-status-badges';

const DEFAULT: ReportFilters = {
  search: '',
  influencerId: 'all',
  campaignId: 'all',
  couponId: 'all',
  status: 'all',
};

export const CouponReports = memo(function CouponReports() {
  const coupons = useMarketingStore((s) => s.coupons);
  const attributions = useMarketingStore((s) => s.attributions);
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const getInfluencer = useMarketingStore((s) => s.getInfluencerById);
  const getCampaign = useMarketingStore((s) => s.getCampaignById);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT);

  const filteredCoupons = useMemo(() => {
    let result = [...coupons];
    if (filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.influencerId !== 'all') {
      result = result.filter((c) => c.influencerId === filters.influencerId);
    }
    if (filters.campaignId !== 'all') {
      result = result.filter((c) => c.campaignId === filters.campaignId);
    }
    if (filters.couponId !== 'all') {
      result = result.filter((c) => c.id === filters.couponId);
    }
    return result;
  }, [coupons, filters]);

  const filteredAttrs = useMemo(
    () => filterAttributions(attributions, filters),
    [attributions, filters],
  );

  const totals = useMemo(() => {
    const revenue = filteredAttrs.reduce((s, a) => s + a.attributedRevenue, 0);
    const discount = filteredAttrs.reduce((s, a) => s + a.discountAmount, 0);
    const usage = filteredCoupons.reduce((s, c) => s + c.usageCount, 0);
    return { revenue, discount, usage, orders: filteredAttrs.length };
  }, [filteredAttrs, filteredCoupons]);

  const columns: Column<AdminCoupon>[] = [
    {
      key: 'code',
      header: 'Código',
      cell: (c) => <span className="font-mono">{c.code}</span>,
    },
    {
      key: 'type',
      header: 'Tipo',
      cell: (c) => <CouponTypeBadge type={c.discountType} />,
      hideOnMobile: true,
    },
    {
      key: 'influencer',
      header: 'Influenciador',
      cell: (c) =>
        c.influencerId ? (getInfluencer(c.influencerId)?.name ?? '—') : '—',
      hideOnMobile: true,
    },
    {
      key: 'campaign',
      header: 'Campanha',
      cell: (c) =>
        c.campaignId ? (getCampaign(c.campaignId)?.name ?? '—') : '—',
      hideOnMobile: true,
    },
    {
      key: 'usage',
      header: 'Utilizações',
      cell: (c) => `${c.usageCount}${c.usageLimit ? ` / ${c.usageLimit}` : ''}`,
    },
    {
      key: 'orders',
      header: 'Pedidos',
      cell: (c) => filteredAttrs.filter((a) => a.couponId === c.id).length,
    },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (c) => formatCurrency(getCouponRevenue(c.id, attributions)),
    },
    {
      key: 'discount',
      header: 'Desconto',
      cell: (c) => formatCurrency(getCouponDiscount(c.id, attributions)),
      hideOnMobile: true,
    },
    {
      key: 'created',
      header: 'Criação',
      cell: (c) => formatDate(c.createdAt),
      hideOnMobile: true,
    },
    {
      key: 'validity',
      header: 'Validade',
      cell: (c) => `${c.startDate} — ${c.endDate}`,
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <CouponStatusBadge status={c.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatório de Cupons"
        description="Utilização, faturamento e validade."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativo' },
            { value: 'paused', label: 'Pausado' },
            { value: 'expired', label: 'Expirado' },
          ]}
        />
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
          { title: 'Utilizações', value: totals.usage },
          { title: 'Pedidos', value: totals.orders },
          { title: 'Faturamento', value: formatCurrency(totals.revenue) },
          { title: 'Desconto', value: formatCurrency(totals.discount) },
        ]}
      />
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredCoupons}
              keyExtractor={(c) => c.id}
            />
          </div>
          <div className="space-y-2 p-4 md:hidden">
            {filteredCoupons.map((c) => (
              <div
                key={c.id}
                className="border-border rounded-md border p-3 text-sm"
              >
                <p className="font-mono font-medium">{c.code}</p>
                <p className="text-muted-foreground">
                  {c.usageCount} usos ·{' '}
                  {formatCurrency(getCouponRevenue(c.id, attributions))}
                </p>
              </div>
            ))}
          </div>
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
