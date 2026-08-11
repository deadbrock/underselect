'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Bell, Moon, Plus, Search, Sun } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTheme } from 'next-themes';

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from '@presentation/components/ui';
import { useAdminStore } from '@presentation/stores/admin';
import { MOCK_ADMIN_PROFILE, searchAdmin } from '@shared/data/admin.data';

import { AdminBreadcrumb } from './admin-breadcrumb';
import { AdminNotificationsPanel } from './admin-notifications-panel';

export const AdminHeader = memo(function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const notifications = useAdminStore((s) => s.notifications);
  const setGlobalSearchQuery = useAdminStore((s) => s.setGlobalSearchQuery);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const results = search.length >= 2 ? searchAdmin(search) : [];

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setGlobalSearchQuery(value);
      setSearchOpen(value.length >= 2);
    },
    [setGlobalSearchQuery],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-[var(--header-height)] items-center gap-3 px-4 md:px-6">
        <div className="hidden min-w-0 flex-1 md:block">
          <AdminBreadcrumb />
        </div>

        <div className="relative flex-1 md:max-w-sm md:flex-none lg:max-w-md">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Buscar produtos, pedidos..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search.length >= 2 && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="h-9 pl-9"
            aria-label="Busca global"
          />
          {searchOpen && results.length > 0 && (
            <div
              className="border-border bg-background absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border shadow-lg"
              role="listbox"
            >
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={r.href as Route}
                  className="hover:bg-muted flex flex-col px-3 py-2 text-sm transition-colors"
                  role="option"
                >
                  <span>{r.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {r.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Nova ação rápida"
            asChild
          >
            <Link href="/admin/produtos">
              <Plus className="size-4" />
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="bg-brand-bronze absolute top-1.5 right-1.5 size-2 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <AdminNotificationsPanel />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="gap-2 px-2"
                aria-label="Menu do perfil"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {MOCK_ADMIN_PROFILE.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm lg:inline">
                  {MOCK_ADMIN_PROFILE.name.split(' ')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="font-medium">{MOCK_ADMIN_PROFILE.name}</p>
                <p className="text-muted-foreground text-xs font-normal">
                  {MOCK_ADMIN_PROFILE.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/perfil">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/configuracoes">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                Sair (integração futura)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});
