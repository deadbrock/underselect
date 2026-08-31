'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import {
  Flag,
  FolderTree,
  Layers,
  Monitor,
  Package,
  Shirt,
} from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { useCatalogVersionStore } from '@presentation/stores/admin/catalog-version.store';
import {
  ADMIN_CATALOG_MOBILE_NAV,
  ADMIN_CATALOG_MOBILE_PATH,
} from '@shared/constants/admin.constants';
import { cn } from '@shared/utils/cn';

const TAB_ICONS = {
  Produtos: Package,
  Categorias: FolderTree,
  Coleções: Layers,
  Times: Shirt,
  Seleções: Flag,
} as const;

function isTabActive(href: string, pathname: string): boolean {
  if (href === ADMIN_CATALOG_MOBILE_PATH) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/novo`) ||
      /\/admin\/catalogo-mobile\/[^/]+\/editar$/.test(pathname)
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface CatalogMobileShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const CatalogMobileShell = memo(function CatalogMobileShell({
  title,
  description,
  children,
}: CatalogMobileShellProps) {
  const pathname = usePathname();
  const openCatalogDialog = useCatalogVersionStore((state) => state.openDialog);

  return (
    <div className="bg-background mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-lg flex-col">
      <header className="border-border flex items-start justify-between gap-3 border-b px-4 py-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[0.625rem] tracking-[0.2em] uppercase">
            Catálogo mobile
          </p>
          <h1 className="text-lg font-medium tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => openCatalogDialog()}
        >
          <Monitor className="size-3.5" />
          Web
        </Button>
      </header>

      <div className="flex-1 px-4 py-4 pb-24">{children}</div>

      <nav
        className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:left-[var(--sidebar-width)]"
        style={{ height: 'var(--bottom-nav-height)' }}
        aria-label="Catálogo mobile"
      >
        <ul className="mx-auto flex h-full max-w-lg items-center justify-around">
          {ADMIN_CATALOG_MOBILE_NAV.map((item) => {
            const Icon = TAB_ICONS[item.label];
            const active = isTabActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className={cn(
                    'flex min-w-14 flex-col items-center gap-0.5 px-2 py-1 transition-colors',
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-5" />
                  <span className="text-[0.625rem] tracking-wider uppercase">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
});
