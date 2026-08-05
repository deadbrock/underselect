'use client';

import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import { STOCK_ITEM_STATUS_LABELS } from '@shared/constants/stock.constants';
import type { StockItemStatus } from '@shared/types/stock.types';
import { cn } from '@shared/utils/cn';

const VARIANT: Record<
  StockItemStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  ok: 'secondary',
  low: 'default',
  out: 'destructive',
  excess: 'outline',
};

export const StockStatusBadge = memo(function StockStatusBadge({
  status,
  className,
}: {
  status: StockItemStatus;
  className?: string;
}) {
  return (
    <Badge variant={VARIANT[status]} className={cn(className)}>
      {STOCK_ITEM_STATUS_LABELS[status]}
    </Badge>
  );
});
