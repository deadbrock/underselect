'use client';

import Link from 'next/link';
import { memo } from 'react';

import { Card, CardContent } from '@presentation/components/ui';
import { useMarketingStore } from '@presentation/stores/admin/marketing';
import { getCouponRevenue } from '@presentation/stores/admin/marketing';
import type { AdminCoupon } from '@shared/types/marketing-admin.types';
import { formatCurrency } from '@shared/utils/format';

import { CouponStatusBadge, CouponTypeBadge } from './marketing-status-badges';

interface CouponCardsProps {
  coupons: AdminCoupon[];
}

export const CouponCards = memo(function CouponCards({
  coupons,
}: CouponCardsProps) {
  const getInfluencer = useMarketingStore((s) => s.getInfluencerById);
  const attributions = useMarketingStore((s) => s.attributions);

  return (
    <div className="space-y-3">
      {coupons.map((c) => (
        <Link
          key={c.id}
          href={`/admin/marketing/cupons/${c.id}`}
          className="block"
        >
          <Card className="hover:bg-muted/30 shadow-none transition-colors">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-medium">{c.code}</p>
                  <p className="text-muted-foreground text-xs">{c.name}</p>
                </div>
                <CouponStatusBadge status={c.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CouponTypeBadge type={c.discountType} />
                {c.influencerId && (
                  <span className="text-muted-foreground text-xs">
                    {getInfluencer(c.influencerId)?.name}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="tabular-nums">
                  {c.usageCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ''} usos
                </span>
                <span className="tabular-nums">
                  {formatCurrency(getCouponRevenue(c.id, attributions))}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
});
