import Link from 'next/link';
import type { Route } from 'next';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface HomeSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: Route | string;
  linkLabel?: string;
  className?: string;
}

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'Ver todos',
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10',
        className,
      )}
    >
      <div className="max-w-xl space-y-2">
        {eyebrow ? (
          <p className="text-luxury text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Button
          variant="link"
          asChild
          className="shrink-0 self-start sm:self-auto"
        >
          <Link href={href as Route}>{linkLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
