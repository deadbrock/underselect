'use client';

import { memo, useMemo } from 'react';

import { VariantSelector } from '@presentation/components/product';
import { cn } from '@shared/utils/cn';
import type { ProductDetail } from '@shared/types/product-detail.types';

export interface PdpVariantsProps {
  product: ProductDetail;
  selectedSize?: string;
  selectedColor?: string;
  selectedModel?: string;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onModelChange: (value: string) => void;
  className?: string;
}

const PdpVariants = memo(function PdpVariants({
  product,
  selectedSize,
  selectedColor,
  selectedModel,
  onSizeChange,
  onColorChange,
  onModelChange,
  className,
}: PdpVariantsProps) {
  const sizeOptions = useMemo(
    () =>
      product.sizes.map((size) => ({
        id: size,
        label: size,
        value: size,
        disabled: product.unavailableSizes.includes(size),
      })),
    [product.sizes, product.unavailableSizes],
  );

  const modelOptions = useMemo(
    () =>
      product.models.map((model) => ({
        id: model.id,
        label: model.label,
        value: model.id,
        disabled: model.disabled,
      })),
    [product.models],
  );

  return (
    <div className={cn('space-y-6', className)}>
      <VariantSelector
        label="Tamanho"
        options={sizeOptions}
        value={selectedSize}
        onChange={onSizeChange}
      />

      {product.colors.length > 0 && (
        <div className="space-y-3">
          <span className="text-label">Cor</span>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.id}
                type="button"
                disabled={color.disabled}
                onClick={() => onColorChange(color.id)}
                aria-label={`Cor ${color.label}`}
                aria-pressed={selectedColor === color.id}
                className={cn(
                  'size-10 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-40',
                  selectedColor === color.id
                    ? 'border-foreground ring-foreground/20 ring-2'
                    : 'border-transparent hover:scale-105',
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <VariantSelector
        label="Modelo"
        options={modelOptions}
        value={selectedModel}
        onChange={onModelChange}
      />

      {product.customizationAvailable && (
        <div className="border-border bg-muted/30 space-y-2 border p-4">
          <p className="text-label">Personalização</p>
          <p className="text-muted-foreground text-sm">
            Nome e número — disponível em breve na finalização da compra.
          </p>
        </div>
      )}
    </div>
  );
});

export { PdpVariants };
