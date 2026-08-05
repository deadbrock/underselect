'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

const BottomNav = memo(function BottomNav({
  items,
  className,
}: BottomNavProps) {
  return (
    <nav
      className={cn(
        'border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:hidden',
        className,
      )}
      style={{ height: 'var(--bottom-nav-height)' }}
      aria-label="Navegação principal"
    >
      <ul className="flex h-full items-center justify-around">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href as Route}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 transition-colors',
                item.active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.icon}
              <span className="text-[0.625rem] tracking-wider uppercase">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

export { BottomNav };
