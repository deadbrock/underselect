import type { CatalogProduct } from '@shared/types/catalog.types';
import {
  CATALOG_CATEGORIES,
  CATALOG_TYPES,
} from '@shared/constants/catalog.constants';
import { ADMIN_PRODUCT_COLLECTIONS } from '@shared/constants/product-admin.constants';
import type {
  AdminProduct,
  AdminProductFilters,
  AdminProductInput,
  AdminProductSortOption,
} from '@shared/types/product-admin.types';
import { slugify } from '@shared/utils/slugify';
import {
  deriveProductStockFromVariations,
  deriveSizesFromVariations,
} from '@shared/utils/product-variation.utils';

import type { AdminProductFormSchema } from './product.schemas';

function getCategoryLabel(slug: AdminProduct['category']): string {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

function getTypeLabel(type: AdminProduct['type']): string {
  return CATALOG_TYPES.find((t) => t.value === type)?.label ?? type;
}

function buildVariations(product: CatalogProduct): AdminProduct['variations'] {
  return product.sizes.slice(0, 3).map((size, i) => ({
    id: `var-${product.id}-${size}`,
    size,
    color: 'Principal',
    sku: `${product.id.toUpperCase()}-${size}`,
    price: product.price,
    stock: Math.max(0, 30 - i * 8),
  }));
}

function buildGallery(
  product: CatalogProduct,
  index: number,
): AdminProduct['gallery'] {
  const base = (index % 12) + 1;
  return Array.from({ length: 3 }, (_, i) => ({
    id: `gal-${product.id}-${i}`,
    url: `/images/catalog/product-${((base + i - 1) % 12) + 1}.svg`,
    alt: `${product.name} — ${i + 1}`,
    isCover: i === 0,
    order: i,
  }));
}

export function catalogToAdminProduct(
  product: CatalogProduct,
  index: number,
): AdminProduct {
  const collection =
    ADMIN_PRODUCT_COLLECTIONS[index % ADMIN_PRODUCT_COLLECTIONS.length] ??
    'Verão 2026';
  const stockQuantity = product.inStock ? 20 + (index % 15) : 0;
  const status = product.inStock ? 'active' : 'inactive';

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: `US-${String(index + 1).padStart(4, '0')}`,
    shortDescription: `${product.name} — ${product.brand}, temporada ${product.season}.`,
    fullDescription: `Produto premium UNDER SELECT. ${product.name} com acabamento superior, tecido de alta performance e identidade ${product.categoryLabel}.`,
    category: product.category,
    categoryLabel: product.categoryLabel,
    type: product.type,
    typeLabel: product.typeLabel,
    collection,
    team: product.team,
    selection: product.selection,
    model: 'Padrão',
    brand: product.brand,
    season: product.season,
    tags: product.badge ? [product.badge] : product.isNew ? ['Lançamento'] : [],
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    cost: Math.round(product.price * 0.45),
    weight: 0.25,
    height: 5,
    width: 30,
    length: 40,
    isFeatured: product.isBestSeller,
    isNew: product.isNew ?? false,
    onSale: product.onSale,
    isBestSeller: product.isBestSeller,
    status,
    inStock: product.inStock,
    stockQuantity,
    sizes: product.sizes,
    installmentCount: product.installmentCount,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    badge: product.badge,
    discountPercent: product.discountPercent,
    variations: buildVariations(product),
    gallery: buildGallery(product, index),
    seo: {
      metaTitle: `${product.name} | UNDER SELECT`,
      metaDescription: `Compre ${product.name} na UNDER SELECT. ${product.categoryLabel}, entrega rápida.`,
      keywords: [
        product.brand,
        product.categoryLabel,
        product.team,
        product.selection,
      ]
        .filter(Boolean)
        .join(', '),
      slug: product.slug,
      ogTitle: product.name,
      ogDescription: `Produto premium ${product.brand}`,
      ogImage: product.imageUrl,
    },
    createdAt: product.createdAt,
    updatedAt: product.createdAt,
  };
}

export function seedAdminProducts(): AdminProduct[] {
  return [];
}

export function resolveLabels(
  input: AdminProductInput,
): Pick<AdminProduct, 'categoryLabel' | 'typeLabel'> {
  return {
    categoryLabel: getCategoryLabel(input.category),
    typeLabel: getTypeLabel(input.type),
  };
}

export function createEmptyProductDefaults(): AdminProductInput {
  return {
    name: '',
    slug: '',
    sku: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    type: 'camisa-clube',
    collection: '',
    team: '',
    selection: '',
    model: '',
    brand: 'UNDER SELECT',
    season: '2024/25',
    tags: [],
    price: 99,
    compareAtPrice: undefined,
    cost: undefined,
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    isFeatured: false,
    isNew: false,
    onSale: false,
    isBestSeller: false,
    status: 'draft',
    inStock: true,
    stockQuantity: 0,
    minStock: 5,
    sizes: [],
    installmentCount: 2,
    imageUrl: '/images/catalog/product-1.svg',
    imageAlt: '',
    badge: '',
    variations: [
      {
        id: 'var-default-m',
        size: 'M',
        color: 'Principal',
        model: '',
        sku: '',
        price: 99,
        stock: 0,
      },
    ],
    gallery: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      slug: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
    },
  };
}

export function createEmptyProductFormDefaults(): AdminProductFormSchema {
  const defaults = createEmptyProductDefaults();

  return {
    ...defaults,
    listPrice: 99,
    promoPrice: undefined,
    noPromotionalPrice: true,
    variations: defaults.variations.map((variation) => ({
      id: variation.id,
      size: variation.size ?? 'M',
      color: variation.color ?? 'Principal',
      model: variation.model ?? defaults.model,
      sku: variation.sku,
      price: variation.price,
      stock: variation.stock,
      imageUrl: variation.imageUrl,
    })),
    sizes: ['M'],
  };
}

export function syncVariationsFromForm(
  values: AdminProductFormSchema,
): AdminProductFormSchema['variations'] {
  return values.variations.map((variation, index) => ({
    ...variation,
    size: variation.size.trim().toUpperCase(),
    color: variation.color?.trim() || 'Principal',
    model: variation.model?.trim() || values.model.trim() || 'Padrão',
    sku:
      variation.sku.trim() ||
      `${values.sku.trim() || generateSku()}-${variation.size.trim().toUpperCase()}`,
    id: variation.id ?? `var-${Date.now()}-${index}`,
  }));
}

export function syncSizesAndStockFromVariations(
  values: AdminProductFormSchema,
): Pick<AdminProductFormSchema, 'sizes' | 'stockQuantity' | 'inStock'> {
  const variations = syncVariationsFromForm(values);
  const sizes = deriveSizesFromVariations(variations);
  const stockSummary = deriveProductStockFromVariations(
    variations.map((variation, index) => ({
      id: variation.id ?? `var-${index}`,
      size: variation.size,
      color: variation.color,
      model: variation.model,
      sku: variation.sku,
      price: variation.price,
      stock: variation.stock,
    })),
  );

  return {
    sizes: sizes.length > 0 ? sizes : values.sizes,
    stockQuantity: stockSummary.stockQuantity,
    inStock: stockSummary.inStock,
  };
}

export function formValuesToProductInput(
  values: AdminProductFormSchema,
): AdminProductInput {
  const {
    listPrice: _listPrice,
    promoPrice: _promoPrice,
    noPromotionalPrice: _noPromotionalPrice,
    ...rest
  } = values;

  const syncedVariations = syncVariationsFromForm(values);
  const syncedStock = syncSizesAndStockFromVariations({
    ...values,
    variations: syncedVariations,
  });

  return {
    ...rest,
    ...syncedStock,
    team: values.team?.trim() ? values.team : undefined,
    selection: values.selection?.trim() ? values.selection : undefined,
    imageAlt: values.imageAlt?.trim() ? values.imageAlt : undefined,
    badge: values.badge?.trim() ? values.badge : undefined,
    variations: syncedVariations.map((v) => ({
      id: v.id ?? `var-${Date.now()}`,
      size: v.size,
      color: v.color,
      model: v.model,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      minStock: v.minStock ?? 5,
      imageUrl: v.imageUrl,
    })),
    gallery: values.gallery.map((g, i) => ({
      id: g.id ?? `gal-${Date.now()}-${i}`,
      url: g.url,
      alt: g.alt,
      isCover: g.isCover,
      order: g.order,
    })),
  };
}

export function productToFormValues(
  product: AdminProduct,
): AdminProductFormSchema {
  const {
    categoryLabel: _c,
    typeLabel: _t,
    id: _id,
    createdAt: _ca,
    updatedAt: _ua,
    discountPercent: _d,
    variations,
    ...rest
  } = product;

  const hasPromo =
    Boolean(product.compareAtPrice) && product.compareAtPrice! > product.price;

  return {
    ...rest,
    variations:
      variations.length > 0
        ? variations.map((variation) => ({
            id: variation.id,
            size: variation.size ?? 'M',
            color: variation.color ?? 'Principal',
            model: variation.model ?? product.model ?? 'Padrão',
            sku: variation.sku,
            price: variation.price,
            stock: variation.stock,
            imageUrl: variation.imageUrl,
          }))
        : [
            {
              size: 'M',
              color: 'Principal',
              model: product.model || 'Padrão',
              sku: product.sku,
              price: product.price,
              stock: product.stockQuantity,
            },
          ],
    listPrice: hasPromo ? product.compareAtPrice! : product.price,
    promoPrice: hasPromo ? product.price : undefined,
    noPromotionalPrice: !hasPromo,
    team: rest.team ?? '',
    selection: rest.selection ?? '',
    imageAlt: rest.imageAlt ?? '',
    badge: rest.badge ?? '',
    seo: {
      ...rest.seo,
      ogTitle: rest.seo.ogTitle ?? '',
      ogDescription: rest.seo.ogDescription ?? '',
      ogImage: rest.seo.ogImage ?? '',
    },
  };
}

export function filterProducts(
  products: AdminProduct[],
  filters: AdminProductFilters,
): AdminProduct[] {
  let result = products;

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }
  if (filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.collection !== 'all') {
    result = result.filter((p) => p.collection === filters.collection);
  }
  if (filters.team !== 'all') {
    result = result.filter((p) => p.team === filters.team);
  }
  if (filters.selection !== 'all') {
    result = result.filter((p) => p.selection === filters.selection);
  }
  if (filters.brand !== 'all') {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.status !== 'all') {
    result = result.filter((p) => p.status === filters.status);
  }
  if (filters.onSale === true) {
    result = result.filter((p) => p.onSale);
  }
  if (filters.isNew === true) {
    result = result.filter((p) => p.isNew);
  }
  if (filters.inStock === true) {
    result = result.filter((p) => p.inStock);
  }
  if (filters.inStock === false) {
    result = result.filter((p) => !p.inStock);
  }
  if (filters.priceMin !== undefined) {
    result = result.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }

  return result;
}

export function sortProducts(
  products: AdminProduct[],
  sort: AdminProductSortOption,
): AdminProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'stock-asc':
      return sorted.sort((a, b) => a.stockQuantity - b.stockQuantity);
    case 'stock-desc':
      return sorted.sort((a, b) => b.stockQuantity - a.stockQuantity);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    default:
      return sorted;
  }
}

export function generateSku(prefix = 'US'): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export function prepareProductFormValues(
  values: AdminProductFormSchema,
): AdminProductFormSchema {
  const name = values.name.trim();
  const slug = values.slug.trim() || (name ? slugify(name) : '');
  const sku = values.sku.trim() || generateSku();
  const shortDescription = values.shortDescription.trim();
  const fullDescription = values.fullDescription.trim();

  const normalizeOptionalNumber = (value: unknown): number | undefined => {
    if (value === '' || value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const listPrice = Number(values.listPrice) || 0;
  const promoPrice = normalizeOptionalNumber(values.promoPrice);
  const noPromotionalPrice = values.noPromotionalPrice;

  const price = noPromotionalPrice ? listPrice : (promoPrice ?? listPrice);
  const compareAtPrice = noPromotionalPrice ? undefined : listPrice;
  const onSale =
    !noPromotionalPrice &&
    promoPrice != null &&
    promoPrice > 0 &&
    promoPrice < listPrice;

  const syncedVariations = syncVariationsFromForm({
    ...values,
    price,
    compareAtPrice,
    onSale,
  });
  const syncedStock = syncSizesAndStockFromVariations({
    ...values,
    price,
    compareAtPrice,
    onSale,
    variations: syncedVariations,
  });

  return {
    ...values,
    name,
    slug,
    sku,
    shortDescription,
    fullDescription,
    listPrice,
    promoPrice: noPromotionalPrice ? undefined : promoPrice,
    noPromotionalPrice,
    price,
    compareAtPrice,
    onSale,
    variations: syncedVariations,
    sizes: syncedStock.sizes,
    stockQuantity: syncedStock.stockQuantity,
    inStock: syncedStock.inStock,
    cost: normalizeOptionalNumber(values.cost),
    weight: normalizeOptionalNumber(values.weight),
    height: normalizeOptionalNumber(values.height),
    width: normalizeOptionalNumber(values.width),
    length: normalizeOptionalNumber(values.length),
    team: values.team?.trim() ?? '',
    selection: values.selection?.trim() ?? '',
    seo: {
      ...values.seo,
      slug: values.seo.slug.trim() || slug,
      metaTitle:
        values.seo.metaTitle.trim() ||
        (name ? `${name} | UNDER SELECT` : values.seo.metaTitle),
      metaDescription:
        values.seo.metaDescription.trim() ||
        shortDescription ||
        fullDescription.slice(0, 160),
      keywords: values.seo.keywords.trim(),
      ogTitle: values.seo.ogTitle?.trim() ?? '',
      ogDescription: values.seo.ogDescription?.trim() ?? '',
      ogImage: values.seo.ogImage?.trim() ?? '',
    },
  };
}

export { slugify };
