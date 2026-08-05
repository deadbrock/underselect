'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';

export interface PdpMobileBarProps {
  productName: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  canPurchase: boolean;
  onBuyNow?: () => void;
  className?: string;
}

const PdpMobileBar = memo(function PdpMobileBar({
  price,
  compareAtPrice,
  inStock,
  canPurchase,
  onBuyNow,
  className,
}: PdpMobileBarProps) {
  return (
    <div
      className={cn(
        'border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden',
        className,
      )}
      role="region"
      aria-label="Ações de compra"
    >
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 flex-1">
          <Price value={price} compareAt={compareAtPrice} size="sm" />
        </div>
        <Button
          variant="bronze"
          size="lg"
          className="shrink-0 px-6"
          disabled={!inStock || !canPurchase}
          onClick={onBuyNow}
          aria-label="Comprar agora"
        >
          Comprar
        </Button>
      </div>
    </div>
  );
});

export { PdpMobileBar };
