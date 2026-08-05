'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Separator,
} from '@presentation/components/ui';
import {
  FOOTER_ACCOUNT,
  HEADER_ACTIONS,
  MAIN_NAV,
  STORE_NAME,
} from '@shared/constants/store-navigation';

export interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileNavDrawer = memo(function MobileNavDrawer({
  open,
  onOpenChange,
}: MobileNavDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent side="left" className="w-[min(100vw,320px)]">
        <DrawerHeader className="border-b pb-4 text-left">
          <DrawerTitle className="text-luxury">{STORE_NAME}</DrawerTitle>
        </DrawerHeader>

        <nav
          className="flex-1 overflow-y-auto px-2 py-4"
          aria-label="Menu mobile"
        >
          <ul className="space-y-1">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href as Route}
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-muted flex items-center justify-between px-3 py-3 text-sm transition-colors"
                >
                  {item.label}
                  <ChevronRight className="text-muted-foreground size-4" />
                </Link>
                {item.children?.length ? (
                  <ul className="border-border ml-3 border-l pl-3">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href as Route}
                          onClick={() => onOpenChange(false)}
                          className="text-muted-foreground hover:text-foreground block px-3 py-2 text-sm transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <ul className="space-y-1">
            {FOOTER_ACCOUNT.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href as Route}
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-muted block px-3 py-3 text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={HEADER_ACTIONS.login}
                onClick={() => onOpenChange(false)}
                className="hover:bg-muted block px-3 py-3 text-sm transition-colors"
              >
                Entrar
              </Link>
            </li>
          </ul>
        </nav>
      </DrawerContent>
    </Drawer>
  );
});
