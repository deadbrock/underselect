import type {
  CatalogCategorySlug,
  CatalogProductType,
} from '@shared/mocks/catalog.types';

export type AdminProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

export type AdminProductSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'stock-asc'
  | 'stock-desc'
  | 'newest'
  | 'oldest';

export type AdminProductViewMode = 'list' | 'grid';

export interface AdminProductVariation {
  id: string;
  size?: string;
  color?: string;
  model?: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface AdminProductGalleryImage {
  id: string;
  url: string;
  alt?: string;
  isCover: boolean;
  order: number;
}

export interface AdminProductSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  slug: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  category: CatalogCategorySlug;
  categoryLabel: string;
  type: CatalogProductType;
  typeLabel: string;
  collection: string;
  team?: string;
  selection?: string;
  brand: string;
  season: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  cost?: number;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  isFeatured: boolean;
  isNew: boolean;
  onSale: boolean;
  isBestSeller: boolean;
  status: AdminProductStatus;
  inStock: boolean;
  stockQuantity: number;
  sizes: string[];
  installmentCount: number;
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
  discountPercent?: number;
  variations: AdminProductVariation[];
  gallery: AdminProductGalleryImage[];
  seo: AdminProductSeo;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductFilters {
  search: string;
  category: string;
  collection: string;
  team: string;
  selection: string;
  brand: string;
  status: string;
  onSale?: boolean;
  isNew?: boolean;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

export type AdminProductInput = Omit<
  AdminProduct,
  'id' | 'createdAt' | 'updatedAt' | 'categoryLabel' | 'typeLabel'
>;
