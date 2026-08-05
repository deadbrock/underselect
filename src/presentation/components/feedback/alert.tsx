import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

const alertVariants = cva('relative w-full border p-4', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      info: 'border-brand-bronze/30 bg-brand-bronze/5 text-foreground',
      success:
        'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100',
      warning:
        'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
      destructive: 'border-destructive/30 bg-destructive/5 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

const icons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

const Alert = memo(function Alert({
  className,
  variant = 'default',
  title,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant ?? 'default'];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
        <div className="space-y-1">
          {title && <p className="text-sm font-medium">{title}</p>}
          {children && (
            <div className="text-muted-foreground text-sm">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
});

export { Alert, alertVariants };
