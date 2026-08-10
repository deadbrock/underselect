'use client';

import Link from 'next/link';
import { memo } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { Button } from '@presentation/components/ui';
import { INFLUENCER_CHANNEL_LABELS } from '@shared/constants/marketing-admin.constants';
import type {
  AdminInfluencer,
  InfluencerListMetrics,
} from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { InfluencerStatusBadge } from './marketing-status-badges';

interface InfluencerTableProps {
  influencers: AdminInfluencer[];
  metricsMap: Map<string, InfluencerListMetrics>;
}

export const InfluencerTable = memo(function InfluencerTable({
  influencers,
  metricsMap,
}: InfluencerTableProps) {
  const columns: Column<AdminInfluencer>[] = [
    {
      key: 'name',
      header: 'Nome',
      cell: (inf) => (
        <div>
          <Link
            href={`/admin/marketing/influenciadores/${inf.id}`}
            className="font-medium hover:underline"
          >
            {inf.name}
          </Link>
          <p className="text-muted-foreground text-xs">{inf.username}</p>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Canal',
      cell: (inf) => {
        const m = metricsMap.get(inf.id);
        return m ? INFLUENCER_CHANNEL_LABELS[m.mainChannel] : '—';
      },
      hideOnMobile: true,
    },
    {
      key: 'campaigns',
      header: 'Campanhas',
      cell: (inf) => metricsMap.get(inf.id)?.campaignCount ?? 0,
      hideOnMobile: true,
    },
    {
      key: 'coupons',
      header: 'Cupons',
      cell: (inf) => metricsMap.get(inf.id)?.couponCount ?? 0,
      hideOnMobile: true,
    },
    {
      key: 'usage',
      header: 'Utilizações',
      cell: (inf) => metricsMap.get(inf.id)?.usageCount ?? 0,
    },
    {
      key: 'orders',
      header: 'Pedidos',
      cell: (inf) => metricsMap.get(inf.id)?.orderCount ?? 0,
    },
    {
      key: 'revenue',
      header: 'Faturamento',
      cell: (inf) =>
        formatCurrency(metricsMap.get(inf.id)?.attributedRevenue ?? 0),
    },
    {
      key: 'discount',
      header: 'Desconto',
      cell: (inf) =>
        formatCurrency(metricsMap.get(inf.id)?.discountGenerated ?? 0),
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (inf) => <InfluencerStatusBadge status={inf.status} />,
    },
    {
      key: 'actions',
      header: 'Ações',
      cell: (inf) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/marketing/influenciadores/${inf.id}`}>Ver</Link>
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={influencers}
      keyExtractor={(i) => i.id}
    />
  );
});
