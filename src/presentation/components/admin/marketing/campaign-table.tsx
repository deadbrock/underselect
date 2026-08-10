'use client';

import Link from 'next/link';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Button } from '@presentation/components/ui';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import type { AdminCampaign } from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { CampaignStatusBadge } from './marketing-status-badges';

interface CampaignTableProps {
  campaigns: AdminCampaign[];
}

export const CampaignTable = memo(function CampaignTable({
  campaigns,
}: CampaignTableProps) {
  const getInfluencer = useMarketingStore((s) => s.getInfluencerById);
  const getAttributions = useMarketingStore((s) => s.getAttributionsByCampaign);

  const columns: Column<AdminCampaign>[] = [
    {
      key: 'name',
      header: 'Campanha',
      cell: (c) => (
        <Link
          href={`/admin/marketing/campanhas/${c.id}`}
          className="font-medium hover:underline"
        >
          {c.name}
        </Link>
      ),
    },
    {
      key: 'influencer',
      header: 'Influenciador',
      cell: (c) => getInfluencer(c.influencerId)?.name ?? '—',
      hideOnMobile: true,
    },
    {
      key: 'period',
      header: 'Período',
      cell: (c) => `${c.startDate} — ${c.endDate}`,
      hideOnMobile: true,
    },
    {
      key: 'coupons',
      header: 'Cupons',
      cell: (c) => c.couponIds.length,
      hideOnMobile: true,
    },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (c) => {
        const rev = getAttributions(c.id).reduce(
          (s, a) => s + a.attributedRevenue,
          0,
        );
        return formatCurrency(rev);
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <CampaignStatusBadge status={c.status} />,
    },
    {
      key: 'actions',
      header: 'Ações',
      cell: (c) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/marketing/campanhas/${c.id}`}>Ver</Link>
        </Button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={campaigns} keyExtractor={(c) => c.id} />
  );
});
