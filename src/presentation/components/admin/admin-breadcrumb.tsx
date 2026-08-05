'use client';

import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';

import { Breadcrumb, type BreadcrumbItem } from '@presentation/components/ui';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';
import { ORDER_NAV_ITEMS } from '@shared/constants/order-admin.constants';
import { STOCK_NAV_ITEMS } from '@shared/constants/stock.constants';

export interface AdminBreadcrumbProps {
  className?: string;
}

export const AdminBreadcrumb = memo(function AdminBreadcrumb({
  className,
}: AdminBreadcrumbProps) {
  const pathname = usePathname();

  const items = useMemo((): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Admin', href: '/admin/dashboard' },
    ];

    if (pathname === '/admin/dashboard') {
      crumbs.push({ label: 'Dashboard' });
      return crumbs;
    }

    const productsMeta = ADMIN_MODULE_META.produtos;
    const isProductsSection =
      pathname === productsMeta.path ||
      pathname.startsWith(`${productsMeta.path}/`);

    if (isProductsSection) {
      crumbs.push({ label: 'Produtos', href: productsMeta.path });
      if (pathname.endsWith('/novo')) {
        crumbs.push({ label: 'Novo produto' });
      } else if (pathname.includes('/editar')) {
        crumbs.push({ label: 'Editar' });
      } else if (
        pathname !== productsMeta.path &&
        !pathname.endsWith('/novo')
      ) {
        crumbs.push({ label: 'Detalhes' });
      }
      return crumbs;
    }

    const stockMeta = ADMIN_MODULE_META.estoque;
    const isStockSection =
      pathname === stockMeta.path || pathname.startsWith(`${stockMeta.path}/`);

    if (isStockSection) {
      crumbs.push({ label: 'Estoque', href: stockMeta.path });
      const sub = STOCK_NAV_ITEMS.find(
        (item) =>
          pathname === item.href ||
          (item.href !== stockMeta.path && pathname.startsWith(item.href)),
      );
      if (sub && sub.href !== stockMeta.path) {
        crumbs.push({ label: sub.label });
      }
      return crumbs;
    }

    const ordersMeta = ADMIN_MODULE_META.pedidos;
    const isOrdersSection =
      pathname === ordersMeta.path ||
      pathname.startsWith(`${ordersMeta.path}/`);

    if (isOrdersSection) {
      crumbs.push({ label: 'Pedidos', href: ordersMeta.path });
      const sub = ORDER_NAV_ITEMS.find(
        (item) =>
          pathname === item.href ||
          (item.href !== ordersMeta.path && pathname.startsWith(item.href)),
      );
      if (sub && sub.href !== ordersMeta.path) {
        crumbs.push({ label: sub.label });
      } else if (
        pathname !== ordersMeta.path &&
        pathname !== `${ordersMeta.path}/lista` &&
        !pathname.endsWith('/lista')
      ) {
        const segments = pathname.split('/');
        const last = segments[segments.length - 1];
        if (last && last !== 'pedidos' && last !== 'lista') {
          crumbs.push({ label: 'Detalhes' });
        }
      }
      return crumbs;
    }

    const moduleEntry = Object.values(ADMIN_MODULE_META).find(
      (m) => pathname === m.path || pathname.startsWith(m.path + '/'),
    );

    if (moduleEntry) {
      crumbs.push({ label: moduleEntry.title });
    } else {
      const segment = pathname.split('/').pop() ?? '';
      crumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
      });
    }

    return crumbs;
  }, [pathname]);

  return <Breadcrumb items={items} className={className} />;
});
