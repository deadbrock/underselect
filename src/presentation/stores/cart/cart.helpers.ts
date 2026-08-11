import type { CatalogProduct } from '@shared/types/catalog.types';
import type { ProductDetail } from '@shared/types/product-detail.types';
import type { AddCartItemInput, CartLineItem } from '@shared/types/cart.types';

export function buildCartLineId(
  productId: string,
  size: string,
  colorId: string,
  modelId: string,
): string {
  return `${productId}:${size}:${colorId}:${modelId}`;
}

export function catalogProductToCartInput(
  product: CatalogProduct,
): AddCartItemInput {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    categoryLabel: product.categoryLabel,
    category: product.category,
    team: product.team,
    selection: product.selection,
    size: product.sizes[0] ?? 'M',
    colorId: 'padrao',
    colorLabel: 'Padrão',
    modelId: 'padrao',
    modelLabel: 'Padrão',
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    installmentCount: product.installmentCount,
    quantity: 1,
  };
}

export function productDetailToCartInput(
  product: ProductDetail,
  selections: { size: string; colorId: string; modelId: string },
): AddCartItemInput {
  const color = product.colors.find((c) => c.id === selections.colorId);
  const model = product.models.find((m) => m.id === selections.modelId);

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.images[0]?.url ?? product.imageUrl,
    categoryLabel: product.categoryLabel,
    category: product.category,
    team: product.team,
    selection: product.selection,
    size: selections.size,
    colorId: selections.colorId,
    colorLabel: color?.label ?? selections.colorId,
    modelId: selections.modelId,
    modelLabel: model?.label ?? selections.modelId,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    installmentCount: product.installmentCount,
    quantity: 1,
  };
}

export function createCartLineItem(input: AddCartItemInput): CartLineItem {
  const lineId = buildCartLineId(
    input.productId,
    input.size,
    input.colorId,
    input.modelId,
  );

  return {
    lineId,
    productId: input.productId,
    slug: input.slug,
    name: input.name,
    imageUrl: input.imageUrl,
    categoryLabel: input.categoryLabel,
    category: input.category,
    team: input.team,
    selection: input.selection,
    size: input.size,
    colorId: input.colorId,
    colorLabel: input.colorLabel,
    modelId: input.modelId,
    modelLabel: input.modelLabel,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    installmentCount: input.installmentCount,
    quantity: input.quantity ?? 1,
  };
}

export function formatCartVariant(item: CartLineItem): string {
  return `Tam. ${item.size} · ${item.colorLabel} · ${item.modelLabel}`;
}

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, '').slice(0, 8);
}

export function formatCep(cep: string): string {
  const digits = normalizeCep(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
