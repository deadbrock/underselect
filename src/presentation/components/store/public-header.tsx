'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ChevronDown, Heart, Menu, Search, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo, useEffect, useState } from 'react';

import { Button } from '@presentation/components/ui';
import { CartHeaderButton } from '@presentation/components/checkout';
import { PromoBar } from '@presentation/components/store/promo-bar';
import { useStoreSettings } from '@presentation/contexts/store-settings-context';
import { cn } from '@shared/utils/cn';
import {
  HEADER_ACTIONS,
  MAIN_NAV,
  type NavCategory,
} from '@shared/constants/store-navigation';
import { useIsMobile } from '@presentation/hooks';

const MobileNavDrawer = dynamic(
  () =>
    import('@presentation/components/store/mobile-nav-drawer').then(
      (mod) => mod.MobileNavDrawer,
    ),
  { ssr: false },
);

const CategoryDropdown = dynamic(
  () =>
    import('@presentation/components/store/category-dropdown').then(
      (mod) => mod.CategoryDropdown,
    ),
  { loading: () => null },
);

interface HeaderActionProps {
  href: Route;
  label: string;
  icon: React.ReactNode;
  compact?: boolean;
}

const HeaderAction = memo(function HeaderAction({
  href,
  label,
  icon,
  compact,
}: HeaderActionProps) {
  return (
    <Button
      variant="ghost"
      size={compact ? 'icon' : 'default'}
      className={cn(!compact && 'hidden gap-2 lg:inline-flex')}
      asChild
    >
      <Link href={href} aria-label={label}>
        {icon}
        {!compact && (
          <span className="text-label hidden xl:inline">{label}</span>
        )}
      </Link>
    </Button>
  );
});

const DesktopNav = memo(function DesktopNav({
  items,
}: {
  items: NavCategory[];
}) {
  return (
    <nav
      className="hidden items-center gap-6 lg:flex"
      aria-label="Menu principal"
    >
      {items.map((item) =>
        item.children?.length ? (
          <CategoryDropdown key={item.label} category={item} />
        ) : (
          <Link
            key={item.label}
            href={item.href as Route}
            className="text-label text-muted-foreground hover:text-foreground transition-luxury"
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
});

export const PublicHeader = memo(function PublicHeader() {
  const settings = useStoreSettings();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <PromoBar
        enabled={settings.promoBarEnabled}
        message={settings.promoBarMessage}
        className={cn(
          'overflow-hidden transition-all duration-300',
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100',
        )}
      />

      <div
        className={cn(
          'border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 border-b backdrop-blur transition-all duration-300',
          isScrolled ? 'shadow-sm' : '',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8',
            isScrolled ? 'h-14' : 'h-[var(--header-height)]',
          )}
        >
          <div className="flex items-center gap-3 lg:gap-6">
            {isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menu"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="size-5" />
                </Button>
                <MobileNavDrawer
                  open={mobileOpen}
                  onOpenChange={setMobileOpen}
                />
              </>
            )}

            <Link
              href="/"
              className={cn(
                'text-foreground font-medium tracking-[0.25em] uppercase transition-all duration-300',
                isScrolled ? 'text-xs' : 'text-sm',
              )}
            >
              {settings.storeName}
            </Link>
          </div>

          <DesktopNav items={MAIN_NAV} />

          <div className="flex items-center gap-0.5 sm:gap-1">
            <HeaderAction
              href={HEADER_ACTIONS.search}
              label="Buscar"
              icon={<Search className="size-5" strokeWidth={1.5} />}
              compact
            />
            <HeaderAction
              href={HEADER_ACTIONS.account}
              label="Minha Conta"
              icon={<User className="size-5" strokeWidth={1.5} />}
            />
            <HeaderAction
              href={HEADER_ACTIONS.favorites}
              label="Favoritos"
              icon={<Heart className="size-5" strokeWidth={1.5} />}
              compact
            />
            <CartHeaderButton compact />
          </div>
        </div>

        {!isMobile && (
          <div className="border-border hidden border-t lg:block">
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 sm:px-6 lg:px-8">
              {MAIN_NAV.map((item) => (
                <Link
                  key={`quick-${item.label}`}
                  href={item.href as Route}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase transition-colors"
                >
                  {item.label}
                  {item.children?.length ? (
                    <ChevronDown className="size-3 opacity-50" />
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
