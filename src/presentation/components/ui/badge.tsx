import { cva, type VariantProps } from 'class-variance-authority';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-[0.625rem] font-medium transition-luxury',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-foreground text-background',
        bronze: 'border-transparent bg-brand-bronze text-brand-white',
        outline: 'border-foreground text-foreground',
        secondary: 'border-transparent bg-muted text-muted-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = memo(function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
});

export { Badge, badgeVariants };
