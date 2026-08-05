import Link from 'next/link';
import type { Route } from 'next';

import { cn } from '@shared/utils/cn';
import { PROMO_BAR } from '@shared/constants/store-navigation';

export interface PromoBarProps {
  message?: string;
  href?: Route;
  enabled?: boolean;
  className?: string;
}

export function PromoBar({
  message = PROMO_BAR.message,
  href = PROMO_BAR.href,
  enabled = PROMO_BAR.enabled,
  className,
}: PromoBarProps) {
  if (!enabled) return null;

  return (
    <div
      className={cn(
        'bg-foreground text-background text-center transition-all duration-300',
        className,
      )}
    >
      <Link
        href={href}
        className="hover:text-brand-bronze-light block px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase transition-colors"
      >
        {message}
      </Link>
    </div>
  );
}
