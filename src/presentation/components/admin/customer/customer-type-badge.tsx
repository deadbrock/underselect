'use client';

import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import {
  ADMIN_CUSTOMER_TYPE_LABELS,
  CUSTOMER_TYPE_VARIANT,
} from '@shared/constants/customer-admin.constants';
import type { AdminCustomerType } from '@shared/types/customer-admin.types';
import { cn } from '@shared/utils/cn';

export const CustomerTypeBadge = memo(function CustomerTypeBadge({
  type,
  className,
}: {
  type: AdminCustomerType;
  className?: string;
}) {
  return (
    <Badge variant={CUSTOMER_TYPE_VARIANT[type]} className={cn(className)}>
      {ADMIN_CUSTOMER_TYPE_LABELS[type]}
    </Badge>
  );
});
