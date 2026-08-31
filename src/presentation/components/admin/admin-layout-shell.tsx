'use client';

import { Menu } from 'lucide-react';
import { BarChart3, LayoutDashboard, Package, Settings } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@presentation/components/ui';
import { SidebarLayout } from '@presentation/components/layout';
import { BottomNav } from '@presentation/components/mobile';
import { MobileSidebar } from '@presentation/components/navigation';
import { useCatalogVersionStore } from '@presentation/stores/admin/catalog-version.store';
import {
  ADMIN_BOTTOM_NAV,
  ADMIN_CATALOG_GROUP_LABEL,
  ADMIN_NAV_GROUPS,
  isAdminMobileCatalogPath,
  isAdminWebCatalogPath,
} from '@shared/constants/admin.constants';
import { cn } from '@shared/utils/cn';

import { AdminAuthHydrator } from './admin-auth-hydrator';
import { AdminFooter } from './admin-footer';
import { AdminGlobalLoader } from './admin-global-loader';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';
import { CatalogVersionDialog } from './catalog-version-dialog';

const BOTTOM_ICONS = {
  Início: LayoutDashboard,
  Pedidos: Package,
  Catálogo: Package,
  Mais: Settings,
} as const;

export interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export const AdminLayoutShell = memo(function AdminLayoutShell({
  children,
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const openCatalogDialog = useCatalogVersionStore((state) => state.openDialog);
  const webCatalogExpanded = useCatalogVersionStore(
    (state) => state.webCatalogExpanded,
  );
  const isCatalogMobile = isAdminMobileCatalogPath(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const drawerItems = useMemo(() => {
    const showWebCatalogChildren =
      webCatalogExpanded || isAdminWebCatalogPath(pathname);

    return ADMIN_NAV_GROUPS.flatMap((group) => {
      if (group.label === ADMIN_CATALOG_GROUP_LABEL) {
        const catalogItem = {
          label: group.label,
          href: '/admin/produtos',
          onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            setMobileMenuOpen(false);
            openCatalogDialog();
          },
        };

        if (!showWebCatalogChildren) return [catalogItem];

        return [
          catalogItem,
          ...(group.children?.map((child) => ({
            label: child.label,
            href: child.href,
          })) ?? []),
        ];
      }

      if (group.href && !group.children) {
        return [{ label: group.label, href: group.href }];
      }

      return (
        group.children?.map((child) => ({
          label: child.label,
          href: child.href,
        })) ?? []
      );
    });
  }, [openCatalogDialog, pathname, webCatalogExpanded]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const bottomNavItems = ADMIN_BOTTOM_NAV.map((item) => {
    const isCatalogItem = item.label === ADMIN_CATALOG_GROUP_LABEL;

    return {
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
      active: isCatalogItem
        ? isAdminWebCatalogPath(pathname) || isAdminMobileCatalogPath(pathname)
        : pathname === item.href ||
          (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)),
      onClick: isCatalogItem
        ? (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            openCatalogDialog();
          }
        : undefined,
    };
  });

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col',
        isCatalogMobile
          ? 'pb-[var(--bottom-nav-height)]'
          : 'pb-[var(--bottom-nav-height)] md:pb-0',
      )}
    >
      <AdminAuthHydrator />
      <AdminGlobalLoader />
      <CatalogVersionDialog />

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
          items={drawerItems}
          title="Admin"
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
        <span className="text-sm font-medium tracking-wide">Admin</span>
      </div>

      <AdminHeader />

      <div className="flex flex-1">
        <SidebarLayout sidebar={<AdminSidebar />}>
          <main className={cn('flex min-h-0 flex-1 flex-col')}>
            <div
              className={cn(
                'flex-1 p-4 md:p-6 lg:p-8',
                isCatalogMobile && 'p-0 md:p-0 lg:p-0',
              )}
            >
              {children}
            </div>
            {!isCatalogMobile && <AdminFooter />}
          </main>
        </SidebarLayout>
      </div>

      {!isCatalogMobile && <BottomNav items={bottomNavItems} />}
    </div>
  );
});
