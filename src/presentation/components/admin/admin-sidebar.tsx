'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  Settings,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import { memo } from 'react';

import { Button, Separator } from '@presentation/components/ui';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';
import {
  ADMIN_NAV_GROUPS,
  type AdminNavGroup,
} from '@shared/constants/admin.constants';

import { useAdminLogout } from './use-admin-logout';

const GROUP_ICONS: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Catálogo: Package,
  Vendas: ShoppingCart,
  Operações: BarChart3,
  Marketing: Megaphone,
  Sistema: Settings,
};

function isGroupActive(group: AdminNavGroup, pathname: string): boolean {
  if (group.href) return pathname === group.href;
  return (
    group.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + '/'),
    ) ?? false
  );
}

function isChildActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

export const AdminSidebar = memo(function AdminSidebar() {
  const pathname = usePathname();
  const handleLogout = useAdminLogout();

  const defaultOpen = ADMIN_NAV_GROUPS.filter(
    (g) => g.children && isGroupActive(g, pathname),
  ).map((g) => g.label);

  return (
    <nav className="flex h-full flex-col py-6" aria-label="Menu administrativo">
      <Link
        href="/admin/dashboard"
        className="text-luxury mb-6 px-4 transition-opacity hover:opacity-80"
      >
        UNDER SELECT
      </Link>
      <span className="text-muted-foreground mb-4 px-4 text-[0.625rem] tracking-[0.2em] uppercase">
        Painel Admin
      </span>

      <div className="flex-1 overflow-y-auto px-2">
        <Accordion type="multiple" defaultValue={defaultOpen}>
          {ADMIN_NAV_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.label] ?? LayoutDashboard;

            if (group.href && !group.children) {
              const active = pathname === group.href;
              return (
                <Link
                  key={group.label}
                  href={group.href as Route}
                  className={cn(
                    'mb-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                    active
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {group.label}
                </Link>
              );
            }

            const groupActive = isGroupActive(group, pathname);

            return (
              <AccordionItem
                key={group.label}
                value={group.label}
                className="border-none"
              >
                <AccordionTrigger
                  className={cn(
                    'hover:bg-muted/50 rounded-none px-3 py-2.5 text-sm hover:no-underline',
                    groupActive && 'text-foreground font-medium',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {group.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pl-4">
                  <ul className="space-y-0.5">
                    {group.children?.map((child) => {
                      const active = isChildActive(child.href, pathname);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href as Route}
                            className={cn(
                              'block px-3 py-2 text-sm transition-colors',
                              active
                                ? 'text-brand-bronze font-medium'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                            aria-current={active ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Separator className="my-4" />
      <div className="px-2">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground w-full justify-start gap-3"
          onClick={() => void handleLogout()}
        >
          <LogOut className="size-4" aria-hidden />
          Sair
        </Button>
      </div>
      <p className="text-muted-foreground px-4 pt-4 text-xs">
        ERP UNDER SELECT v1.0
      </p>
    </nav>
  );
});
