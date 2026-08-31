'use client';

import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';

import { Breadcrumb, type BreadcrumbItem } from '@presentation/components/ui';
import {
  ADMIN_CATALOG_MOBILE_NAV,
  ADMIN_CATALOG_MOBILE_PATH,
  ADMIN_MODULE_META,
  isAdminMobileCatalogPath,
} from '@shared/constants/admin.constants';
import { CUSTOMER_NAV_ITEMS } from '@shared/constants/customer-admin.constants';
import { MARKETING_NAV_ITEMS } from '@shared/constants/marketing-admin.constants';
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

    if (isAdminMobileCatalogPath(pathname)) {
      crumbs.push({
        label: 'Catálogo mobile',
        href: ADMIN_CATALOG_MOBILE_PATH,
      });
      if (pathname.endsWith('/novo')) {
        crumbs.push({ label: 'Novo produto' });
      } else if (pathname.includes('/editar')) {
        crumbs.push({ label: 'Editar' });
      } else {
        const tab = ADMIN_CATALOG_MOBILE_NAV.find(
          (item) =>
            item.href !== ADMIN_CATALOG_MOBILE_PATH &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`)),
        );
        if (tab) crumbs.push({ label: tab.label });
      }
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

    const customersMeta = ADMIN_MODULE_META.clientes;
    const isCustomersSection =
      pathname === customersMeta.path ||
      pathname.startsWith(`${customersMeta.path}/`);

    if (isCustomersSection) {
      crumbs.push({ label: 'Clientes', href: customersMeta.path });
      const sub = CUSTOMER_NAV_ITEMS.find(
        (item) =>
          pathname === item.href ||
          (item.href !== customersMeta.path && pathname.startsWith(item.href)),
      );
      if (sub && sub.href !== customersMeta.path) {
        crumbs.push({ label: sub.label });
      } else if (
        pathname !== customersMeta.path &&
        pathname !== `${customersMeta.path}/lista` &&
        !pathname.endsWith('/lista')
      ) {
        const segments = pathname.split('/');
        const last = segments[segments.length - 1];
        if (last && last !== 'clientes' && last !== 'lista') {
          crumbs.push({ label: 'Perfil' });
        }
      }
      return crumbs;
    }

    const isMarketingSection =
      pathname === '/admin/marketing' ||
      pathname.startsWith('/admin/marketing/');

    if (isMarketingSection) {
      crumbs.push({ label: 'Marketing', href: '/admin/marketing' });
      const sub = MARKETING_NAV_ITEMS.find(
        (item) =>
          pathname === item.href ||
          (item.href !== '/admin/marketing' && pathname.startsWith(item.href)),
      );
      if (sub && sub.href !== '/admin/marketing') {
        crumbs.push({ label: sub.label });
      } else if (pathname.includes('/novo') || pathname.includes('/editar')) {
        crumbs.push({
          label: pathname.includes('/novo') ? 'Novo' : 'Editar',
        });
      } else if (
        pathname !== '/admin/marketing' &&
        !pathname.includes('/relatorios')
      ) {
        const segments = pathname.split('/');
        const last = segments[segments.length - 1];
        if (
          last &&
          !['marketing', 'influenciadores', 'campanhas', 'cupons'].includes(
            last,
          )
        ) {
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
