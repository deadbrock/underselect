'use client';

import { memo, useMemo } from 'react';

import { PdpActions } from './pdp-actions';
import { PdpPricing } from './pdp-pricing';
import { PdpTrustBadges } from './pdp-trust-badges';
import { PdpVariants } from './pdp-variants';
import { cn } from '@shared/utils/cn';
import { getProductPurchaseState } from '@shared/utils/product-variation.utils';
import type { ProductDetail } from '@shared/types/product-detail.types';

export interface PdpBuyBoxProps {
  product: ProductDetail;
  selectedSize?: string;
  selectedColor?: string;
  selectedModel?: string;
  sizeStockAlert?: string | null;
  onSizeStockAlertChange?: (message: string | null) => void;
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
  sizeStockAlert,
  onSizeStockAlertChange,
  onSizeChange,
  onColorChange,
  onModelChange,
  onAddToCart,
  onBuyNow,
  sticky = true,
  className,
}: PdpBuyBoxProps) {
  const selectedColorOption = product.colors.find(
    (color) => color.id === selectedColor,
  );
  const selectedModelOption = product.models.find(
    (model) => model.id === selectedModel,
  );

  const { activeVariation, variationInStock, hasVariations } = useMemo(
    () =>
      getProductPurchaseState(product, {
        size: selectedSize,
        colorLabel: selectedColorOption?.label,
        modelLabel: selectedModelOption?.label,
      }),
    [
      product,
      selectedColorOption?.label,
      selectedModelOption?.label,
      selectedSize,
    ],
  );

  const canPurchase = Boolean(
    selectedSize && selectedColor && selectedModel && variationInStock,
  );

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
      <PdpPricing product={product} variation={activeVariation} />

      {selectedSize && activeVariation && activeVariation.stock > 0 && (
        <p className="text-muted-foreground text-sm">
          {activeVariation.stock} unidade
          {activeVariation.stock === 1 ? '' : 's'} disponível
          {activeVariation.stock === 1 ? '' : 'eis'} no tamanho {selectedSize}
        </p>
      )}

      {!hasVariations && !product.inStock && (
        <p className="text-destructive text-sm">
          Produto indisponível no momento.
        </p>
      )}

      <PdpVariants
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        selectedModel={selectedModel}
        sizeStockAlert={sizeStockAlert}
        onSizeStockAlertChange={onSizeStockAlertChange}
        onSizeChange={onSizeChange}
        onColorChange={onColorChange}
        onModelChange={onModelChange}
      />
      <PdpActions
        inStock={variationInStock}
        canPurchase={canPurchase}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
      <PdpTrustBadges estimatedDelivery={product.estimatedDelivery} />
    </aside>
  );
});

export { PdpBuyBox };
