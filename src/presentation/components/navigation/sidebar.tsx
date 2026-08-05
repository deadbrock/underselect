'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Separator,
} from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

import type { NavItem } from './navbar';

export interface SidebarProps {
  items: NavItem[];
  footer?: React.ReactNode;
  title?: string;
  className?: string;
  collapsed?: boolean;
}

const Sidebar = memo(function Sidebar({
  items,
  footer,
  title = 'Under Select',
  className,
  collapsed = false,
}: SidebarProps) {
  return (
    <nav
      className={cn(
        'flex h-full flex-col py-6',
        collapsed ? 'px-2' : 'px-4',
        className,
      )}
    >
      {!collapsed && <span className="text-luxury mb-8 px-2">{title}</span>}
      <ul className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href as Route}
              className={cn(
                'text-muted-foreground hover:bg-muted hover:text-foreground transition-luxury flex items-center px-3 py-2.5 text-sm',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              {collapsed ? item.label.charAt(0) : item.label}
            </Link>
          </li>
        ))}
      </ul>
      {footer && (
        <>
          <Separator className="my-4" />
          <div className={cn(collapsed && 'px-1')}>{footer}</div>
        </>
      )}
    </nav>
  );
});

export interface MobileSidebarProps extends SidebarProps {
  trigger: React.ReactNode;
}

const MobileSidebar = memo(function MobileSidebar({
  trigger,
  items,
  title,
  footer,
}: MobileSidebarProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent side="left" className="w-[280px]">
        <DrawerHeader>
          <DrawerTitle className="text-luxury">{title}</DrawerTitle>
        </DrawerHeader>
        <Sidebar items={items} footer={footer} title="" className="pt-0" />
      </DrawerContent>
    </Drawer>
  );
});

export { Sidebar, MobileSidebar };
