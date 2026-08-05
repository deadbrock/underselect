import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

const Breadcrumb = memo(function Breadcrumb({
  items,
  className,
  separator = <ChevronRight className="size-3.5" />,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <span className="text-muted-foreground" aria-hidden>
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href as Route}
                  className="text-muted-foreground hover:text-foreground transition-luxury"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export { Breadcrumb };
