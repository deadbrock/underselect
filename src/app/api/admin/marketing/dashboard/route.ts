import { NextResponse } from 'next/server';

import { listCoupons } from '@infrastructure/database/repositories/coupon.repository';
import { listInfluencers } from '@infrastructure/database/repositories/influencer.repository';
import {
  getMarketingDashboardStats,
  listAttributions,
} from '@infrastructure/database/repositories/order.repository';
import type {
  AdminCoupon,
  AdminInfluencer,
  CouponAttribution,
} from '@shared/types/marketing-admin.types';
import { toApiErrorResponse, toApiResponse } from '@shared/utils';

function parsePeriod(searchParams: URLSearchParams) {
  const period = searchParams.get('period');
  const now = new Date();

  if (period === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { dateFrom: start, dateTo: now };
  }

  if (period === '7d') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { dateFrom: start, dateTo: now };
  }

  if (period === '30d') {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    return { dateFrom: start, dateTo: now };
  }

  if (period === 'this-month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateFrom: start, dateTo: now };
  }

  if (period === 'last-month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { dateFrom: start, dateTo: end };
  }

  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  return {
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(`${dateTo}T23:59:59.999Z`) : undefined,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { dateFrom, dateTo } = parsePeriod(searchParams);

    const [stats, attributions, coupons, influencers] = await Promise.all([
      getMarketingDashboardStats(dateFrom, dateTo),
      listAttributions({
        dateFrom,
        dateTo,
        limit: 10,
      }),
      listCoupons(),
      listInfluencers({ status: 'active' }),
    ]);

    const topCoupons = [...coupons]
      .sort((a: AdminCoupon, b: AdminCoupon) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map((c: AdminCoupon) => ({ label: c.code, value: c.usageCount }));

    const revenueByInfluencer = influencers
      .slice(0, 5)
      .map((inf: AdminInfluencer) => ({
        label: inf.name.split(' ')[0] ?? inf.name,
        value: attributions
          .filter((a: CouponAttribution) => a.influencerId === inf.id)
          .reduce(
            (sum: number, a: CouponAttribution) => sum + a.attributedRevenue,
            0,
          ),
      }));

    return NextResponse.json(
      toApiResponse({
        stats,
        recentAttributions: attributions,
        charts: {
          topCoupons,
          revenueByInfluencer,
        },
      }),
    );
  } catch (error) {
    return NextResponse.json(toApiErrorResponse(error), { status: 500 });
  }
}
