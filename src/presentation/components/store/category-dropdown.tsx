'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo, useState } from 'react';

import { cn } from '@shared/utils/cn';
import type { NavCategory } from '@shared/constants/store-navigation';

export interface CategoryDropdownProps {
  category: NavCategory;
}

export const CategoryDropdown = memo(function CategoryDropdown({
  category,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={category.href as Route}
        className="text-label text-muted-foreground hover:text-foreground transition-luxury inline-flex items-center gap-1"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {category.label}
      </Link>

      {category.children?.length ? (
        <div
          className={cn(
            'bg-background border-border absolute top-full left-0 z-50 min-w-[220px] border py-2 shadow-lg transition-all duration-200',
            open
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-1 opacity-0',
          )}
        >
          {category.children.map((child) => (
            <Link
              key={child.label}
              href={child.href as Route}
              className="hover:bg-muted block px-4 py-2.5 text-sm transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
});
