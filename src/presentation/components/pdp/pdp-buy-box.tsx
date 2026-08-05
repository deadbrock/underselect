'use client';

import { memo } from 'react';

import { PdpActions } from './pdp-actions';
import { PdpPricing } from './pdp-pricing';
import { PdpTrustBadges } from './pdp-trust-badges';
import { PdpVariants } from './pdp-variants';
import { cn } from '@shared/utils/cn';
import type { ProductDetail } from '@shared/mocks/product-detail.types';

export interface PdpBuyBoxProps {
  product: ProductDetail;
  selectedSize?: string;
  selectedColor?: string;
  selectedModel?: string;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  sticky?: boolean;
  className?: string;
}

const PdpBuyBox = memo(function PdpBuyBox({
  product,
  selectedSize,
  selectedColor,
  selectedModel,
  onSizeChange,
  onColorChange,
  onModelChange,
  onAddToCart,
  onBuyNow,
  sticky = true,
  className,
}: PdpBuyBoxProps) {
  const canPurchase = Boolean(selectedSize && selectedColor && selectedModel);

  return (
    <aside
      className={cn(
        'space-y-6',
        sticky &&
          'lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start',
        className,
      )}
      aria-label="Informações de compra"
    >
      <PdpPricing product={product} />
      <PdpVariants
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        selectedModel={selectedModel}
        onSizeChange={onSizeChange}
        onColorChange={onColorChange}
        onModelChange={onModelChange}
      />
      <PdpActions
        inStock={product.inStock}
        canPurchase={canPurchase}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
      <PdpTrustBadges estimatedDelivery={product.estimatedDelivery} />
    </aside>
  );
});

export { PdpBuyBox };
