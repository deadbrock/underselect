'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { Badge, Button } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';
import { shouldUnoptimizeImage } from '@shared/utils/media-src';
import type { CatalogProduct } from '@shared/types/catalog.types';
import { toast } from '@presentation/hooks';
import {
  catalogProductToCartInput,
  useCartStore,
} from '@presentation/stores/cart';

export interface CatalogProductCardProps {
  product: CatalogProduct;
  priority?: boolean;
  onQuickView?: (product: CatalogProduct) => void;
  className?: string;
}

function formatInstallment(price: number, count: number): string {
  const value = price / count;
  return `${count}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`;
}

export const CatalogProductCard = memo(function CatalogProductCard({
  product,
  priority = false,
  onQuickView,
  className,
}: CatalogProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((v) => !v);
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!product.inStock) return;
      addItem(catalogProductToCartInput(product));
      toast.success('Produto adicionado à sacola');
    },
    [addItem, product],
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.(product);
    },
    [onQuickView, product],
  );

  return (
    <article
      className={cn('group relative', className)}
      aria-label={product.name}
    >
      <Link href={`/produto/${product.slug}` as Route} className="block">
        <div className="bg-muted relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4"
            priority={priority}
            unoptimized={shouldUnoptimizeImage(product.imageUrl)}
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.isNew && <Badge variant="bronze">Novo</Badge>}
            {product.badge && <Badge variant="outline">{product.badge}</Badge>}
            {product.onSale && product.discountPercent && (
              <Badge variant="bronze">−{product.discountPercent}%</Badge>
            )}
            {!product.inStock && <Badge variant="secondary">Esgotado</Badge>}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="bg-background/90 size-10 backdrop-blur-sm"
              onClick={toggleFavorite}
              aria-label={
                isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
              }
              aria-pressed={isFavorite}
            >
              <Heart
                className={cn(
                  'size-4',
                  isFavorite && 'fill-brand-bronze text-brand-bronze',
                )}
              />
            </Button>
            {onQuickView && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-background/90 size-10 backdrop-blur-sm"
                onClick={handleQuickView}
                aria-label="Visualização rápida"
              >
                <Eye className="size-4" />
              </Button>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-full gap-2"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <ShoppingBag className="size-4" />
              {product.inStock ? 'Adicionar' : 'Indisponível'}
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 pt-4">
          <p className="text-muted-foreground text-[0.625rem] tracking-[0.15em] uppercase">
            {product.brand} · {product.typeLabel}
          </p>
          <h3 className="line-clamp-2 text-sm font-normal tracking-wide">
            {product.name}
          </h3>
          <Price
            value={product.price}
            compareAt={product.compareAtPrice}
            size="sm"
          />
          <p className="text-muted-foreground text-xs">
            {formatInstallment(product.price, product.installmentCount)} sem
            juros
          </p>
        </div>
      </Link>
    </article>
  );
});
