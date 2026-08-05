import { memo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; label: string };
  className?: string;
}

const StatCard = memo(function StatCard({
  title,
  value,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('shadow-none', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-label text-muted-foreground font-normal">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium tabular-nums">{value}</p>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  trend.value >= 0 ? 'text-green-600' : 'text-destructive',
                )}
              >
                {trend.value >= 0 ? '+' : ''}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export { StatCard };
