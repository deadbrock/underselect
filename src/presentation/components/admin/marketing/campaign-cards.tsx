'use client';

import Link from 'next/link';
import { memo } from 'react';

import { Card, CardContent } from '@presentation/components/ui';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import type { AdminCampaign } from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { CampaignStatusBadge } from './marketing-status-badges';

interface CampaignCardsProps {
  campaigns: AdminCampaign[];
}

export const CampaignCards = memo(function CampaignCards({
  campaigns,
}: CampaignCardsProps) {
  const getInfluencer = useMarketingStore((s) => s.getInfluencerById);
  const getAttributions = useMarketingStore((s) => s.getAttributionsByCampaign);

  return (
    <div className="space-y-3">
      {campaigns.map((c) => {
        const rev = getAttributions(c.id).reduce(
          (s, a) => s + a.attributedRevenue,
          0,
        );
        return (
          <Link
            key={c.id}
            href={`/admin/marketing/campanhas/${c.id}`}
            className="block"
          >
            <Card className="hover:bg-muted/30 shadow-none transition-colors">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {getInfluencer(c.influencerId)?.name ?? '—'}
                    </p>
                  </div>
                  <CampaignStatusBadge status={c.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {c.startDate} — {c.endDate}
                  </span>
                  <span className="tabular-nums">{formatCurrency(rev)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
});
