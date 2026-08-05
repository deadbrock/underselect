import { Container } from '@presentation/components/layout';
import { Breadcrumb, Skeleton } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface PagePlaceholderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: `/${string}` | '/' }[];
  children?: React.ReactNode;
  className?: string;
}

export function PagePlaceholder({
  title,
  description,
  breadcrumbs,
  children,
  className,
}: PagePlaceholderProps) {
  return (
    <Container className={cn('py-8 md:py-12', className)}>
      {breadcrumbs?.length ? (
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            label: item.label,
            href: item.href,
          }))}
          className="mb-6"
        />
      ) : null}

      <header className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {description}
          </p>
        ) : null}
      </header>

      {children ?? <ContentSkeleton />}
    </Container>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-24 w-full max-w-xl" />
    </div>
  );
}
