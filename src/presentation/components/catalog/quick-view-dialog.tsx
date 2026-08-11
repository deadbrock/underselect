'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { memo, useCallback } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { toast } from '@presentation/hooks';
import {
  catalogProductToCartInput,
  useCartStore,
} from '@presentation/stores/cart';
import type { CatalogProduct } from '@shared/types/catalog.types';

export interface QuickViewDialogProps {
  product: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickViewDialog = memo(function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: QuickViewDialogProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(() => {
    if (!product?.inStock) return;
    addItem(catalogProductToCartInput(product));
    toast.success('Produto adicionado à sacola');
    onOpenChange(false);
  }, [addItem, onOpenChange, product]);

  if (!product) return null;

  const installment = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price / product.installmentCount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <div className="grid md:grid-cols-2">
          <div className="bg-muted relative aspect-square md:aspect-auto md:min-h-[400px]">
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-col p-6">
            <DialogHeader className="text-left">
              <p className="text-luxury text-muted-foreground mb-2">
                {product.brand}
              </p>
              <DialogTitle className="text-lg">{product.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-2">
              <Price value={product.price} compareAt={product.compareAtPrice} />
              <p className="text-muted-foreground text-sm">
                {product.installmentCount}x de {installment} sem juros
              </p>
              <p className="text-muted-foreground text-xs">
                Tamanhos: {product.sizes.join(', ')}
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Button size="lg" disabled={!product.inStock} asChild>
                <Link href={`/produto/${product.slug}` as Route}>
                  Ver detalhes
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Adicionar à sacola
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
