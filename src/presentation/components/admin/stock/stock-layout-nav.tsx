'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { STOCK_NAV_ITEMS } from '@shared/constants/stock.constants';
import { cn } from '@shared/utils/cn';

export const StockLayoutNav = memo(function StockLayoutNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-border -mx-4 mb-6 overflow-x-auto border-b px-4 md:-mx-0 md:px-0"
      aria-label="Menu de estoque"
    >
      <ul className="flex min-w-max gap-1 pb-px">
        {STOCK_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/admin/estoque' && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                className={cn(
                  'inline-flex px-3 py-2.5 text-sm whitespace-nowrap transition-colors',
                  active
                    ? 'border-brand-bronze text-foreground border-b-2 font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
