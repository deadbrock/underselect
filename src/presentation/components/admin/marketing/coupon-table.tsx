'use client';

import Link from 'next/link';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Button } from '@presentation/components/ui';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import type { AdminCoupon } from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';
import { getCouponRevenue } from '@presentation/stores/admin/marketing';

import { CouponStatusBadge, CouponTypeBadge } from './marketing-status-badges';

interface CouponTableProps {
  coupons: AdminCoupon[];
}

export const CouponTable = memo(function CouponTable({
  coupons,
}: CouponTableProps) {
  const getInfluencer = useMarketingStore((s) => s.getInfluencerById);
  const getCampaign = useMarketingStore((s) => s.getCampaignById);
  const attributions = useMarketingStore((s) => s.attributions);

  const columns: Column<AdminCoupon>[] = [
    {
      key: 'code',
      header: 'Código',
      cell: (c) => (
        <Link
          href={`/admin/marketing/cupons/${c.id}`}
          className="font-mono font-medium hover:underline"
        >
          {c.code}
        </Link>
      ),
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
      key: 'usage',
      header: 'Utilizações',
      cell: (c) => (
        <span className="tabular-nums">
          {c.usageCount}
          {c.usageLimit ? ` / ${c.usageLimit}` : ''}
        </span>
      ),
    },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (c) => formatCurrency(getCouponRevenue(c.id, attributions)),
    },
    {
      key: 'campaign',
      header: 'Campanha',
      cell: (c) =>
        c.campaignId ? (getCampaign(c.campaignId)?.name ?? '—') : '—',
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <CouponStatusBadge status={c.status} />,
    },
    {
      key: 'actions',
      header: 'Ações',
      cell: (c) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/marketing/cupons/${c.id}`}>Ver</Link>
        </Button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={coupons} keyExtractor={(c) => c.id} />
  );
});
