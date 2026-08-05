'use client';

import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { memo, useEffect, useState } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';
import { useIsMobile } from '@presentation/hooks';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

const defaultItems: NavItem[] = [
  { label: 'Novidades', href: '#' },
  { label: 'Feminino', href: '#' },
  { label: 'Masculino', href: '#' },
  { label: 'Acessórios', href: '#' },
];

const Navbar = memo(function Navbar({
  logo,
  items = defaultItems,
  actions,
  onMenuClick,
  className,
}: NavbarProps) {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur transition-shadow',
        isScrolled && 'shadow-sm',
        className,
      )}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </Button>
          )}
          <Link href="/" className="text-luxury text-foreground">
            {logo ?? 'Under Select'}
          </Link>
        </div>

        {!isMobile && (
          <nav className="hidden items-center gap-8 md:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href as Route}
                className="text-label text-muted-foreground hover:text-foreground transition-luxury"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1">
          {actions ?? (
            <>
              <Button variant="ghost" size="icon" aria-label="Buscar">
                <Search className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Conta">
                <User className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Sacola">
                <ShoppingBag className="size-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export { Navbar };
