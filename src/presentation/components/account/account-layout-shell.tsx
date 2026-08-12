'use client';

import { Menu } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { SidebarLayout } from '@presentation/components/layout';
import { BottomNav } from '@presentation/components/mobile';
import { MobileSidebar } from '@presentation/components/navigation';
import { Heart, LayoutDashboard, Package, Ticket } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AccountAuthHydrator } from './account-auth-hydrator';
import { AccountSidebar } from './account-sidebar';
import { cn } from '@shared/utils/cn';

const BOTTOM_ITEMS = [
  {
    label: 'Início',
    href: '/minha-conta',
    icon: <LayoutDashboard className="size-5" />,
  },
  { label: 'Pedidos', href: '/pedidos', icon: <Package className="size-5" /> },
  {
    label: 'Favoritos',
    href: '/favoritos',
    icon: <Heart className="size-5" />,
  },
  { label: 'Cupons', href: '/cupons', icon: <Ticket className="size-5" /> },
];

const DRAWER_NAV = [
  { label: 'Dashboard', href: '/minha-conta' },
  { label: 'Meus Pedidos', href: '/pedidos' },
  { label: 'Endereços', href: '/enderecos' },
  { label: 'Dados Pessoais', href: '/dados-pessoais' },
  { label: 'Alterar Senha', href: '/alterar-senha' },
  { label: 'Favoritos', href: '/favoritos' },
  { label: 'Lista de Desejos', href: '/lista-desejos' },
  { label: 'Cupons', href: '/cupons' },
  { label: 'Configurações', href: '/configuracoes' },
];

export interface AccountLayoutShellProps {
  children: React.ReactNode;
}

export const AccountLayoutShell = memo(function AccountLayoutShell({
  children,
}: AccountLayoutShellProps) {
  const pathname = usePathname();

  const bottomNavItems = BOTTOM_ITEMS.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + '/'),
  }));

  return (
    <div className="pb-[var(--bottom-nav-height)] md:pb-0">
      <AccountAuthHydrator />
      <div className="border-border flex items-center gap-3 border-b px-4 py-3 md:hidden">
        <MobileSidebar
          trigger={
            <Button
              variant="outline"
              size="icon"
              aria-label="Abrir menu da conta"
            >
              <Menu className="size-5" />
            </Button>
          }
          items={DRAWER_NAV}
          title="Minha Conta"
        />
        <span className="text-sm font-medium tracking-wide">Minha Conta</span>
      </div>

      <SidebarLayout sidebar={<AccountSidebar />}>
        <div className={cn('p-4 md:p-6 lg:p-8')}>{children}</div>
      </SidebarLayout>

      <BottomNav items={bottomNavItems} />
    </div>
  );
});
