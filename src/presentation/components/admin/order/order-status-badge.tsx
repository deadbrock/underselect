'use client';

import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
} from '@shared/constants/order-admin.constants';
import type { AdminOrderStatus } from '@shared/types/order-admin.types';
import { cn } from '@shared/utils/cn';

export const OrderStatusBadge = memo(function OrderStatusBadge({
  status,
  className,
}: {
  status: AdminOrderStatus;
  className?: string;
}) {
  return (
    <Badge variant={ORDER_STATUS_VARIANT[status]} className={cn(className)}>
      {ADMIN_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
});
