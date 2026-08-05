import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Card = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          'bg-card text-card-foreground border shadow-sm',
          className,
        )}
        {...props}
      />
    ),
  ),
);
Card.displayName = 'Card';

const CardHeader = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    ),
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = memo(
  forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn(
          'text-lg leading-none font-medium tracking-tight',
          className,
        )}
        {...props}
      />
    ),
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = memo(
  forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    ),
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    ),
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    ),
  ),
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
