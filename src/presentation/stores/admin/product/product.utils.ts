import {
  CATALOG_CATEGORIES,
  CATALOG_TYPES,
} from '@shared/mocks/catalog.constants';
import { CATALOG_PRODUCTS } from '@shared/mocks/catalog.utils';
import { ADMIN_PRODUCT_COLLECTIONS } from '@shared/constants/product-admin.constants';
import type {
  AdminProduct,
  AdminProductFilters,
  AdminProductInput,
  AdminProductSortOption,
} from '@shared/types/product-admin.types';
import { slugify } from '@shared/utils/slugify';

import type { AdminProductFormSchema } from './product.schemas';

function getCategoryLabel(slug: AdminProduct['category']): string {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

function getTypeLabel(type: AdminProduct['type']): string {
  return CATALOG_TYPES.find((t) => t.value === type)?.label ?? type;
}

function buildVariations(
  product: (typeof CATALOG_PRODUCTS)[0],
): AdminProduct['variations'] {
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
  product: (typeof CATALOG_PRODUCTS)[0],
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
  product: (typeof CATALOG_PRODUCTS)[0],
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
  return CATALOG_PRODUCTS.map(catalogToAdminProduct);
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
    category: 'clubes-brasileiros',
    type: 'camisa-clube',
    collection: ADMIN_PRODUCT_COLLECTIONS[0],
    team: '',
    selection: '',
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
    sizes: ['M'],
    installmentCount: 6,
    imageUrl: '/images/catalog/product-1.svg',
    imageAlt: '',
    badge: '',
    variations: [],
    gallery: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      slug: '',
    },
  };
}

export function formValuesToProductInput(
  values: AdminProductFormSchema,
): AdminProductInput {
  return {
    ...values,
    variations: values.variations.map((v, i) => ({
      id: v.id ?? `var-${Date.now()}-${i}`,
      size: v.size,
      color: v.color,
      model: v.model,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
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

export function productToFormValues(product: AdminProduct): AdminProductInput {
  const {
    categoryLabel: _c,
    typeLabel: _t,
    id: _id,
    createdAt: _ca,
    updatedAt: _ua,
    discountPercent: _d,
    ...rest
  } = product;
  return rest;
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

export { slugify };
