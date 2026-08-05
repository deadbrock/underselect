import { cn } from '@shared/utils/cn';

export interface AccountPageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function AccountPageHeader({
  title,
  description,
  className,
}: AccountPageHeaderProps) {
  return (
    <header className={cn('mb-8 space-y-2', className)}>
      <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
