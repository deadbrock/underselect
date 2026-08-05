import { memo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface ChartCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const ChartCard = memo(function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn('shadow-none', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children ?? (
          <div className="bg-muted flex h-48 items-center justify-center">
            <span className="text-muted-foreground text-xs tracking-wider uppercase">
              Área do gráfico
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export { ChartCard };
