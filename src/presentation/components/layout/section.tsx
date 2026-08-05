import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
}

const Section = memo(function Section({
  className,
  title,
  subtitle,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn('py-8 md:py-12', className)} {...props}>
      {(title || subtitle) && (
        <div className="mb-6 space-y-1">
          {title && (
            <h2 className="text-xl font-medium tracking-tight">{title}</h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
});

export { Section };
