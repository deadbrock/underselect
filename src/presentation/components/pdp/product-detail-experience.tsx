'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { memo, useCallback, useMemo, useState } from 'react';

import { Breadcrumb } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import {
  productDetailToCartInput,
  useCartStore,
} from '@presentation/stores/cart';
import { PdpBuyBox } from './pdp-buy-box';
import { PdpDetailsTabs } from './pdp-details-tabs';
import { PdpGallery } from './pdp-gallery';
import { PdpInfoHeader } from './pdp-info-header';
import { PdpMobileBar } from './pdp-mobile-bar';
import { PdpRelatedSections } from './pdp-related-sections';
import { PdpReviews } from './pdp-reviews';
import type {
  ProductDetail,
  ProductRelatedGroups,
} from '@shared/types/product-detail.types';

export interface ProductDetailExperienceProps {
  product: ProductDetail;
  breadcrumbs: { label: string; href?: `/${string}` | '/' }[];
  related: ProductRelatedGroups;
}

function getDefaultSelection<T extends { disabled?: boolean; id: string }>(
  items: T[],
): string | undefined {
  return items.find((item) => !item.disabled)?.id;
}

const ProductDetailExperience = memo(function ProductDetailExperience({
  product,
  breadcrumbs,
  related,
}: ProductDetailExperienceProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const defaultSize = useMemo(
    () =>
      product.sizes.find((s) => !product.unavailableSizes.includes(s)) ??
      product.sizes[0],
    [product.sizes, product.unavailableSizes],
  );
  const defaultColor = useMemo(
    () => getDefaultSelection(product.colors),
    [product.colors],
  );
  const defaultModel = useMemo(
    () => getDefaultSelection(product.models),
    [product.models],
  );

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  const canPurchase = Boolean(
    selectedSize && selectedColor && selectedModel && product.inStock,
  );

  const handleAddToCart = useCallback(() => {
    if (!canPurchase || !selectedSize || !selectedColor || !selectedModel) {
      return;
    }

    addItem(
      productDetailToCartInput(product, {
        size: selectedSize,
        colorId: selectedColor,
        modelId: selectedModel,
      }),
    );
    toast.success('Produto adicionado à sacola');
  }, [
    addItem,
    canPurchase,
    product,
    selectedColor,
    selectedModel,
    selectedSize,
  ]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push('/carrinho' as Route);
  }, [handleAddToCart, router]);

  return (
    <>
      <Container className="py-6 md:py-10">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <PdpGallery images={product.images} productName={product.name} />

          <div className="space-y-8">
            <PdpInfoHeader product={product} />
            <PdpBuyBox
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              selectedModel={selectedModel}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onModelChange={setSelectedModel}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        <div className="mt-16 space-y-16 pb-24 lg:pb-16">
          <PdpDetailsTabs product={product} />
          <PdpReviews reviews={product.reviews} />
        </div>
      </Container>

      <PdpRelatedSections related={related} />

      <PdpMobileBar
        productName={product.name}
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        inStock={product.inStock}
        canPurchase={canPurchase}
        onBuyNow={handleBuyNow}
      />
    </>
  );
});

export { ProductDetailExperience };
