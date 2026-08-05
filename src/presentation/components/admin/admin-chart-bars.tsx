'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { AdminChartPoint } from '@shared/types/admin.types';

export interface AdminChartBarsProps {
  data: AdminChartPoint[];
  className?: string;
  formatValue?: (value: number) => string;
}

export const AdminChartBars = memo(function AdminChartBars({
  data,
  className,
  formatValue = (v) => String(v),
}: AdminChartBarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn('flex h-48 items-end gap-2 md:gap-3', className)}
      role="img"
      aria-label="Gráfico de barras"
    >
      {data.map((point) => {
        const height = (point.value / max) * 100;
        return (
          <div
            key={point.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-muted-foreground text-[0.625rem] tabular-nums">
              {formatValue(point.value)}
            </span>
            <div
              className="bg-brand-bronze/80 w-full max-w-10 rounded-t-sm transition-all duration-500"
              style={{ height: `${Math.max(height, 4)}%` }}
              title={`${point.label}: ${formatValue(point.value)}`}
            />
            <span className="text-muted-foreground truncate text-[0.625rem]">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});
