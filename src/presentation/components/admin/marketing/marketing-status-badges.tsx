'use client';

import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import {
  ADMIN_CAMPAIGN_STATUS_LABELS,
  ADMIN_COUPON_STATUS_LABELS,
  ADMIN_COUPON_TYPE_LABELS,
  ADMIN_INFLUENCER_STATUS_LABELS,
  CAMPAIGN_STATUS_VARIANT,
  COUPON_STATUS_VARIANT,
  INFLUENCER_STATUS_VARIANT,
} from '@shared/constants/marketing-admin.constants';
import type {
  AdminCampaignStatus,
  AdminCouponDiscountType,
  AdminCouponStatus,
  AdminInfluencerStatus,
} from '@shared/types/marketing-admin.types';
import { cn } from '@shared/utils/cn';

export const InfluencerStatusBadge = memo(function InfluencerStatusBadge({
  status,
  className,
}: {
  status: AdminInfluencerStatus;
  className?: string;
}) {
  return (
    <Badge
      variant={INFLUENCER_STATUS_VARIANT[status]}
      className={cn(className)}
    >
      {ADMIN_INFLUENCER_STATUS_LABELS[status]}
    </Badge>
  );
});

export const CampaignStatusBadge = memo(function CampaignStatusBadge({
  status,
  className,
}: {
  status: AdminCampaignStatus;
  className?: string;
}) {
  return (
    <Badge variant={CAMPAIGN_STATUS_VARIANT[status]} className={cn(className)}>
      {ADMIN_CAMPAIGN_STATUS_LABELS[status]}
    </Badge>
  );
});

export const CouponStatusBadge = memo(function CouponStatusBadge({
  status,
  className,
}: {
  status: AdminCouponStatus;
  className?: string;
}) {
  return (
    <Badge variant={COUPON_STATUS_VARIANT[status]} className={cn(className)}>
      {ADMIN_COUPON_STATUS_LABELS[status]}
    </Badge>
  );
});

export const CouponTypeBadge = memo(function CouponTypeBadge({
  type,
  className,
}: {
  type: AdminCouponDiscountType;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(className)}>
      {ADMIN_COUPON_TYPE_LABELS[type]}
    </Badge>
  );
});
