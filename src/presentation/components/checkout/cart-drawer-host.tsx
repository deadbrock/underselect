'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { memo, useEffect } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@presentation/components/ui';
import { Button } from '@presentation/components/ui';
import { useIsMobile } from '@presentation/hooks';
import {
  formatCartVariant,
  useCartStore,
  useCartTotals,
} from '@presentation/stores/cart';
import { cn } from '@shared/utils/cn';

import { CartEmptyState } from './cart-empty-state';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';

export const CartDrawerHost = memo(function CartDrawerHost() {
  const isMobile = useIsMobile();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const lastAddedLineId = useCartStore((state) => state.lastAddedLineId);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = useCartTotals();

  const lastAddedItem = items.find((item) => item.lineId === lastAddedLineId);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      useCartStore.setState({ lastAddedLineId: null });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [isOpen, lastAddedLineId]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setDrawerOpen}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerContent
        side={isMobile ? 'bottom' : 'right'}
        className={cn(isMobile ? 'max-h-[92vh]' : 'max-w-md', 'flex flex-col')}
      >
        <DrawerHeader className="border-border border-b text-left">
          <DrawerTitle className="text-luxury">
            Sacola ({totals.itemCount})
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {lastAddedItem && (
            <div
              className="bg-muted/40 border-border mb-4 flex items-center gap-3 border p-3"
              role="status"
            >
              <CheckCircle2
                className="text-brand-bronze size-5 shrink-0"
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="bg-muted relative size-12 shrink-0 overflow-hidden">
                  <Image
                    src={lastAddedItem.imageUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {lastAddedItem.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Adicionado à sacola
                  </p>
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <CartEmptyState className="py-10" />
          ) : (
            items.map((item) => (
              <CartItem
                key={item.lineId}
                item={{
                  id: item.lineId,
                  name: item.name,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  quantity: item.quantity,
                  variant: formatCartVariant(item),
                }}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="border-border border-t">
            <CartSummary
              subtotal={totals.subtotal}
              total={totals.total}
              discount={
                totals.catalogDiscount + totals.couponDiscount > 0
                  ? totals.catalogDiscount + totals.couponDiscount
                  : undefined
              }
              className="mb-2"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <DrawerClose asChild>
                <Button variant="outline" size="lg">
                  Continuar comprando
                </Button>
              </DrawerClose>
              <Button size="lg" asChild>
                <Link href={'/carrinho' as Route}>Ir para o carrinho</Link>
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
});
