'use client';

import Link from 'next/link';
import { memo } from 'react';

import { Card, CardContent } from '@presentation/components/ui';
import { INFLUENCER_CHANNEL_LABELS } from '@shared/constants/marketing-admin.constants';
import type {
  AdminInfluencer,
  InfluencerListMetrics,
} from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { InfluencerStatusBadge } from './marketing-status-badges';

interface InfluencerCardsProps {
  influencers: AdminInfluencer[];
  metricsMap: Map<string, InfluencerListMetrics>;
}

export const InfluencerCards = memo(function InfluencerCards({
  influencers,
  metricsMap,
}: InfluencerCardsProps) {
  return (
    <div className="space-y-3">
      {influencers.map((inf) => {
        const m = metricsMap.get(inf.id);
        return (
          <Link
            key={inf.id}
            href={`/admin/marketing/influenciadores/${inf.id}`}
            className="block"
          >
            <Card className="hover:bg-muted/30 shadow-none transition-colors">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{inf.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {inf.identifierCode} · {inf.username}
                    </p>
                  </div>
                  <InfluencerStatusBadge status={inf.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Canal</p>
                    <p>{m ? INFLUENCER_CHANNEL_LABELS[m.mainChannel] : '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Pedidos</p>
                    <p className="tabular-nums">{m?.orderCount ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Faturamento</p>
                    <p className="tabular-nums">
                      {formatCurrency(m?.attributedRevenue ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Utilizações</p>
                    <p className="tabular-nums">{m?.usageCount ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
});
