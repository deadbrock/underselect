import { Breadcrumb } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface CatalogPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: `/${string}` | '/' }[];
  className?: string;
}

export function CatalogPageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
}: CatalogPageHeaderProps) {
  return (
    <header className={cn('mb-8 space-y-4', className)}>
      <Breadcrumb items={breadcrumbs} />
      <div className="max-w-2xl space-y-2">
        {eyebrow && (
          <p className="text-luxury text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
