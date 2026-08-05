'use client';

import { memo } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
} from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

import { CartItem, type CartItemData } from './cart-item';
import { CartSummary } from './cart-summary';

export interface CartDrawerProps {
  trigger: React.ReactNode;
  items: CartItemData[];
  subtotal: number;
  shipping?: number;
  total: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
  className?: string;
}

const CartDrawer = memo(function CartDrawer({
  trigger,
  items,
  subtotal,
  shipping,
  total,
  onQuantityChange,
  onRemove,
  onCheckout,
  className,
}: CartDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn('max-h-[90vh]', className)}>
        <DrawerHeader>
          <DrawerTitle className="text-luxury">Sacola</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sua sacola está vazia.
            </p>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
        {items.length > 0 && (
          <DrawerFooter className="border-t">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              className="mb-4"
            />
            <Button size="lg" onClick={onCheckout}>
              Finalizar compra
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
});

export { CartDrawer };
