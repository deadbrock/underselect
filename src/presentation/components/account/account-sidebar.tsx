'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import {
  Bookmark,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Package,
  Settings,
  Ticket,
  User,
} from 'lucide-react';
import { memo } from 'react';

import { Button, Separator } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { useAccountStore } from '@presentation/stores/account';
import { cn } from '@shared/utils/cn';

const NAV = [
  { label: 'Dashboard', href: '/minha-conta', icon: LayoutDashboard },
  { label: 'Meus Pedidos', href: '/pedidos', icon: Package },
  { label: 'Endereços', href: '/enderecos', icon: MapPin },
  { label: 'Dados Pessoais', href: '/dados-pessoais', icon: User },
  { label: 'Alterar Senha', href: '/alterar-senha', icon: Lock },
  { label: 'Favoritos', href: '/favoritos', icon: Heart },
  { label: 'Lista de Desejos', href: '/lista-desejos', icon: Bookmark },
  { label: 'Cupons', href: '/cupons', icon: Ticket },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
] as const;

export const AccountSidebar = memo(function AccountSidebar() {
  const pathname = usePathname();
  const logout = useAccountStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logout preparado para integração com autenticação.');
  };

  return (
    <nav className="flex h-full flex-col py-6" aria-label="Menu da conta">
      <span className="text-luxury mb-6 px-4">Minha Conta</span>
      <ul className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/minha-conta' && pathname.startsWith(href));

          return (
            <li key={href}>
              <Link
                href={href as Route}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Separator className="my-4" />
      <div className="px-2">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden />
          Sair
        </Button>
      </div>
    </nav>
  );
});
