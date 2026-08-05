'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import { useIsMobile } from '@presentation/hooks';

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SidebarLayout = memo(function SidebarLayout({
  sidebar,
  children,
  className,
}: SidebarLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn('flex min-h-[calc(100vh-var(--header-height))]', className)}
    >
      {!isMobile && (
        <aside className="border-border w-[var(--sidebar-width)] shrink-0 border-r">
          {sidebar}
        </aside>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
});

export { SidebarLayout };
