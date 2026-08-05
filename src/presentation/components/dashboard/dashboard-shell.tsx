'use client';

import { memo } from 'react';

import { SidebarLayout } from '@presentation/components/layout/sidebar-layout';
import { BottomNav } from '@presentation/components/mobile';
import { Sidebar, type NavItem } from '@presentation/components/navigation';
import { cn } from '@shared/utils/cn';

export interface DashboardShellProps {
  sidebarItems: NavItem[];
  bottomNavItems?: React.ComponentProps<typeof BottomNav>['items'];
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardShell = memo(function DashboardShell({
  sidebarItems,
  bottomNavItems,
  header,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      {header}
      <SidebarLayout sidebar={<Sidebar items={sidebarItems} title="Admin" />}>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarLayout>
      {bottomNavItems && <BottomNav items={bottomNavItems} />}
    </div>
  );
});

export { DashboardShell };
