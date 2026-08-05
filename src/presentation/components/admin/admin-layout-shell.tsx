'use client';

import { Menu } from 'lucide-react';
import { BarChart3, LayoutDashboard, Package, Settings } from 'lucide-react';
import { memo } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@presentation/components/ui';
import { SidebarLayout } from '@presentation/components/layout';
import { BottomNav } from '@presentation/components/mobile';
import { MobileSidebar } from '@presentation/components/navigation';
import {
  ADMIN_BOTTOM_NAV,
  ADMIN_NAV_GROUPS,
} from '@shared/constants/admin.constants';
import { cn } from '@shared/utils/cn';

import { AdminFooter } from './admin-footer';
import { AdminGlobalLoader } from './admin-global-loader';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';

const BOTTOM_ICONS = {
  Início: LayoutDashboard,
  Pedidos: Package,
  Produtos: Package,
  Mais: Settings,
} as const;

const DRAWER_ITEMS = ADMIN_NAV_GROUPS.flatMap((group) => {
  if (group.href && !group.children) {
    return [{ label: group.label, href: group.href }];
  }
  return group.children?.map((c) => ({ label: c.label, href: c.href })) ?? [];
});

export interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export const AdminLayoutShell = memo(function AdminLayoutShell({
  children,
}: AdminLayoutShellProps) {
  const pathname = usePathname();

  const bottomNavItems = ADMIN_BOTTOM_NAV.map((item) => ({
    label: item.label,
    href: item.href,
    icon: (() => {
      const Icon = BOTTOM_ICONS[item.label as keyof typeof BOTTOM_ICONS];
      return Icon ? (
        <Icon className="size-5" />
      ) : (
        <BarChart3 className="size-5" />
      );
    })(),
    active:
      pathname === item.href ||
      (item.href !== '/admin/dashboard' &&
        pathname.startsWith(item.href.replace('/admin/', '/admin/'))),
  }));

  return (
    <div className="flex min-h-screen flex-col pb-[var(--bottom-nav-height)] md:pb-0">
      <AdminGlobalLoader />

      <div className="border-border flex items-center gap-3 border-b px-4 py-3 md:hidden">
        <MobileSidebar
          trigger={
            <Button
              variant="outline"
              size="icon"
              aria-label="Abrir menu administrativo"
            >
              <Menu className="size-5" />
            </Button>
          }
          items={DRAWER_ITEMS}
          title="Admin"
        />
        <span className="text-sm font-medium tracking-wide">Admin</span>
      </div>

      <AdminHeader />

      <div className="flex flex-1">
        <SidebarLayout sidebar={<AdminSidebar />}>
          <main className={cn('flex min-h-0 flex-1 flex-col')}>
            <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
            <AdminFooter />
          </main>
        </SidebarLayout>
      </div>

      <BottomNav items={bottomNavItems} />
    </div>
  );
});
