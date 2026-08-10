'use client';

import { memo } from 'react';

import { AdminChartBars } from '@presentation/components/admin/admin-chart-bars';
import { ChartCard } from '@presentation/components/dashboard';
import type { ChartDataPoint } from '@shared/types/marketing-admin.types';

interface MarketingChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  className?: string;
}

export const MarketingBarChart = memo(function MarketingBarChart({
  title,
  description,
  data,
  className,
}: MarketingChartProps) {
  return (
    <ChartCard title={title} description={description} className={className}>
      <AdminChartBars data={data} />
    </ChartCard>
  );
});
