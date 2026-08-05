'use client';

import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

const MobileHeader = memo(function MobileHeader({
  title,
  onBack,
  actions,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        'border-border flex h-14 items-center justify-between border-b px-4 md:hidden',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <h1 className="text-sm font-medium tracking-wide">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
});

export { MobileHeader };
