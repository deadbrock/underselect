import type { ProductCardData } from '@presentation/components/product';

export type CatalogSortOption =
  'best-sellers' | 'price-asc' | 'price-desc' | 'newest' | 'biggest-discount';

export type CatalogProductType =
  | 'camisa-clube'
  | 'camisa-selecao'
  | 'camisa-retro'
  | 'casual-esportiva'
  | 'cueca'
  | 'boxer'
  | 'intima-masculina';

export type CatalogCategorySlug =
  | 'clubes-brasileiros'
  | 'selecoes'
  | 'retro'
  | 'casual-esportiva'
  | 'cuecas-boxer'
  | 'intimas-masculinas';

export interface CatalogProduct extends ProductCardData {
  category: CatalogCategorySlug;
  categoryLabel: string;
  type: CatalogProductType;
  typeLabel: string;
  team?: string;
  selection?: string;
  brand: string;
  season: string;
  sizes: string[];
  installmentCount: number;
  onSale: boolean;
  inStock: boolean;
  isBestSeller: boolean;
  discountPercent?: number;
  createdAt: string;
}

export interface CatalogFilters {
  categories: string[];
  types: string[];
  teams: string[];
  selections: string[];
  brands: string[];
  seasons: string[];
  sizes: string[];
  priceMin?: number;
  priceMax?: number;
  onSale?: boolean;
  inStock?: boolean;
}

export interface CatalogPageConfig {
  title: string;
  description: string;
  eyebrow?: string;
  basePath: string;
  canonicalPath: string;
  presetFilters?: Partial<CatalogFilters>;
  breadcrumbs: { label: string; href?: `/${string}` | '/' }[];
}

export interface CatalogSearchParams {
  q?: string;
  sort?: CatalogSortOption;
  page?: string;
  categories?: string;
  types?: string;
  teams?: string;
  selections?: string;
  brands?: string;
  seasons?: string;
  sizes?: string;
  priceMin?: string;
  priceMax?: string;
  onSale?: string;
  inStock?: string;
}

export const CATALOG_PAGE_SIZE = 12;

export const CATALOG_SORT_LABELS: Record<CatalogSortOption, string> = {
  'best-sellers': 'Mais vendidos',
  'price-asc': 'Menor preço',
  'price-desc': 'Maior preço',
  newest: 'Lançamentos',
  'biggest-discount': 'Maior desconto',
};
