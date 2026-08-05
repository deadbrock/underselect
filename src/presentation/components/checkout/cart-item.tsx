'use client';

import Image from 'next/image';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { QuantityStepper } from '@presentation/components/forms';
import { cn } from '@shared/utils/cn';

export interface CartItemData {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

const CartItem = memo(function CartItem({
  item,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <div className={cn('flex gap-4 border-b py-4', className)}>
      <div className="bg-muted relative size-20 shrink-0 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-normal">{item.name}</h4>
          {item.variant && (
            <p className="text-muted-foreground text-xs">{item.variant}</p>
          )}
          <Price value={item.price} size="sm" className="mt-1" />
        </div>
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            onChange={(qty) => onQuantityChange(item.id, qty)}
          />
          <Button
            variant="link"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground text-xs"
          >
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
});

export { CartItem };
