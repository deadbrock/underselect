import { PackageOpen } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-4 py-16 text-center',
        className,
      )}
    >
      <div className="text-muted-foreground">
        {icon ?? <PackageOpen className="size-12" strokeWidth={1} />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium tracking-wide">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
});

export { EmptyState };
