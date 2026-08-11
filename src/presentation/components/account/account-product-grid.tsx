'use client';

import { X } from 'lucide-react';
import { memo } from 'react';

import { CatalogProductCard } from '@presentation/components/catalog';
import { EmptyState } from '@presentation/components/feedback';
import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { getProductsByIds } from '@shared/data/account.data';
import { useAccountStore } from '@presentation/stores/account';
import type { CatalogProduct } from '@shared/types/catalog.types';

import { AccountPageHeader } from './account-page-header';

export interface AccountRemovableProductGridProps {
  title: string;
  description: string;
  productIds: string[];
  onRemove: (productId: string) => void;
  emptyTitle: string;
}

export const AccountRemovableProductGrid = memo(
  function AccountRemovableProductGrid({
    title,
    description,
    productIds,
    onRemove,
    emptyTitle,
  }: AccountRemovableProductGridProps) {
    const products = getProductsByIds(productIds) as CatalogProduct[];

    const handleRemove = (productId: string) => {
      onRemove(productId);
      toast.success('Produto removido.');
    };

    return (
      <div className="space-y-6">
        <AccountPageHeader title={title} description={description} />

        {products.length === 0 ? (
          <EmptyState title={emptyTitle} className="py-12" />
        ) : (
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4"
            role="list"
          >
            {products.map((product, index) => (
              <div key={product.id} className="relative" role="listitem">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 z-10 size-9 rounded-full shadow-sm"
                  aria-label={`Remover ${product.name}`}
                  onClick={() => handleRemove(product.id)}
                >
                  <X className="size-4" />
                </Button>
                <CatalogProductCard product={product} priority={index < 4} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export const AccountFavoritesGrid = memo(function AccountFavoritesGrid() {
  const favoriteIds = useAccountStore((s) => s.favoriteIds);
  const removeFavorite = useAccountStore((s) => s.removeFavorite);

  return (
    <AccountRemovableProductGrid
      title="Favoritos"
      description="Produtos que você marcou como favoritos."
      productIds={favoriteIds}
      onRemove={removeFavorite}
      emptyTitle="Você ainda não tem favoritos."
    />
  );
});

export const AccountWishlistGrid = memo(function AccountWishlistGrid() {
  const wishlistIds = useAccountStore((s) => s.wishlistIds);
  const removeWishlist = useAccountStore((s) => s.removeWishlist);

  return (
    <AccountRemovableProductGrid
      title="Lista de Desejos"
      description="Salve produtos para comprar depois — estrutura separada dos favoritos."
      productIds={wishlistIds}
      onRemove={removeWishlist}
      emptyTitle="Sua lista de desejos está vazia."
    />
  );
});
