'use client';

import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import {
  ADMIN_CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_VARIANT,
} from '@shared/constants/customer-admin.constants';
import type { AdminCustomerStatus } from '@shared/types/customer-admin.types';
import { cn } from '@shared/utils/cn';

export const CustomerStatusBadge = memo(function CustomerStatusBadge({
  status,
  className,
}: {
  status: AdminCustomerStatus;
  className?: string;
}) {
  return (
    <Badge variant={CUSTOMER_STATUS_VARIANT[status]} className={cn(className)}>
      {ADMIN_CUSTOMER_STATUS_LABELS[status]}
    </Badge>
  );
});
