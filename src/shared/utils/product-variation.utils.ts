export interface ProductVariationOption {
  id: string;
  size?: string;
  color?: string;
  model?: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductVariationSelection {
  size: string;
  colorLabel?: string;
  modelLabel?: string;
}

export function resolveProductVariation(
  variations: ProductVariationOption[],
  selection: ProductVariationSelection,
): ProductVariationOption | undefined {
  if (!variations.length || !selection.size) return undefined;

  const colorLabel = selection.colorLabel ?? 'Principal';
  const modelLabel = selection.modelLabel ?? 'Padrão';

  return (
    variations.find(
      (variation) =>
        variation.size === selection.size &&
        (variation.color ?? 'Principal') === colorLabel &&
        (variation.model ?? 'Padrão') === modelLabel,
    ) ?? variations.find((variation) => variation.size === selection.size)
  );
}

export function deriveSizesFromVariations(
  variations: Array<{ size?: string | null }>,
): string[] {
  const sizes = variations
    .map((variation) => variation.size?.trim())
    .filter((size): size is string => Boolean(size));

  return [...new Set(sizes)];
}

export function deriveUnavailableSizes(
  sizes: string[],
  variations: ProductVariationOption[],
): string[] {
  if (!variations.length) return [];

  return sizes.filter((size) => {
    const sizeVariations = variations.filter(
      (variation) => variation.size === size,
    );

    if (!sizeVariations.length) return true;

    return sizeVariations.every((variation) => variation.stock <= 0);
  });
}

export function deriveProductStockFromVariations(
  variations: ProductVariationOption[],
): { stockQuantity: number; inStock: boolean } {
  const stockQuantity = variations.reduce(
    (total, variation) => total + variation.stock,
    0,
  );

  return {
    stockQuantity,
    inStock: stockQuantity > 0,
  };
}

export function resolveVariationPricing(
  product: {
    price: number;
    compareAtPrice?: number;
    discountPercent?: number;
  },
  variation?: ProductVariationOption,
): {
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
} {
  const price = variation?.price ?? product.price;

  if (
    product.compareAtPrice &&
    product.compareAtPrice > product.price &&
    price === product.price
  ) {
    const discountPercent =
      product.discountPercent ??
      Math.round(
        ((product.compareAtPrice - price) / product.compareAtPrice) * 100,
      );

    return {
      price,
      compareAtPrice: product.compareAtPrice,
      discountPercent,
    };
  }

  return { price };
}

export function getProductPurchaseState(
  product: {
    inStock: boolean;
    variations?: ProductVariationOption[];
  },
  selection: {
    size?: string;
    colorLabel?: string;
    modelLabel?: string;
  },
) {
  const variations = product.variations ?? [];
  const hasVariations = variations.length > 0;
  const activeVariation = selection.size
    ? resolveProductVariation(variations, {
        size: selection.size,
        colorLabel: selection.colorLabel,
        modelLabel: selection.modelLabel,
      })
    : undefined;

  const variationInStock = hasVariations
    ? (activeVariation?.stock ?? 0) > 0
    : product.inStock;

  return {
    activeVariation,
    variationInStock,
    hasVariations,
  };
}
