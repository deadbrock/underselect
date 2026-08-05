import type {
  CatalogFilters,
  CatalogProduct,
  CatalogSearchParams,
  CatalogSortOption,
} from './catalog.types';
import { CATALOG_PAGE_SIZE } from './catalog.types';
import {
  CATALOG_SUBCATEGORY_TEAMS,
  CATALOG_CATEGORIES,
} from './catalog.constants';

const img = (n: number) => `/images/catalog/product-${((n - 1) % 12) + 1}.svg`;

const BASE_PRODUCTS: Omit<
  CatalogProduct,
  'id' | 'slug' | 'name' | 'imageUrl' | 'imageAlt'
>[] = [
  {
    category: 'clubes-brasileiros',
    categoryLabel: 'Clubes Brasileiros',
    type: 'camisa-clube',
    typeLabel: 'Camisa de Clube',
    team: 'Flamengo',
    brand: 'UNDER SELECT',
    season: '2024/25',
    sizes: ['P', 'M', 'G', 'GG'],
    price: 449,
    compareAtPrice: 499,
    installmentCount: 6,
    onSale: true,
    inStock: true,
    isBestSeller: true,
    discountPercent: 10,
    isNew: false,
    badge: 'Oficial',
    createdAt: '2025-11-01',
  },
  {
    category: 'clubes-brasileiros',
    categoryLabel: 'Clubes Brasileiros',
    type: 'camisa-clube',
    typeLabel: 'Camisa de Clube',
    team: 'Corinthians',
    brand: 'Premium Match',
    season: '2024/25',
    sizes: ['M', 'G', 'GG'],
    price: 429,
    installmentCount: 6,
    onSale: false,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    createdAt: '2026-01-15',
  },
  {
    category: 'clubes-brasileiros',
    categoryLabel: 'Clubes Brasileiros',
    type: 'camisa-clube',
    typeLabel: 'Camisa de Clube',
    team: 'Palmeiras',
    brand: 'UNDER SELECT',
    season: '2024/25',
    sizes: ['P', 'M', 'G'],
    price: 439,
    installmentCount: 6,
    onSale: false,
    inStock: true,
    isBestSeller: false,
    isNew: true,
    createdAt: '2026-02-01',
  },
  {
    category: 'clubes-brasileiros',
    categoryLabel: 'Clubes Brasileiros',
    type: 'camisa-clube',
    typeLabel: 'Camisa de Clube',
    team: 'São Paulo',
    brand: 'Elite Sport',
    season: '2024/25',
    sizes: ['M', 'G', 'GG', 'XG'],
    price: 419,
    compareAtPrice: 469,
    installmentCount: 6,
    onSale: true,
    inStock: true,
    isBestSeller: false,
    discountPercent: 11,
    createdAt: '2025-09-10',
  },
  {
    category: 'selecoes',
    categoryLabel: 'Seleções',
    type: 'camisa-selecao',
    typeLabel: 'Camisa de Seleção',
    selection: 'Brasil',
    brand: 'UNDER SELECT',
    season: '2024/25',
    sizes: ['P', 'M', 'G', 'GG'],
    price: 499,
    installmentCount: 6,
    onSale: false,
    inStock: true,
    isBestSeller: true,
    badge: 'Copa',
    isNew: false,
    createdAt: '2025-06-01',
  },
  {
    category: 'selecoes',
    categoryLabel: 'Seleções',
    type: 'camisa-selecao',
    typeLabel: 'Camisa de Seleção',
    selection: 'Argentina',
    brand: 'Premium Match',
    season: '2024/25',
    sizes: ['M', 'G', 'GG'],
    price: 479,
    compareAtPrice: 529,
    installmentCount: 6,
    onSale: true,
    inStock: true,
    isBestSeller: true,
    discountPercent: 9,
    createdAt: '2025-08-20',
  },
  {
    category: 'selecoes',
    categoryLabel: 'Seleções',
    type: 'camisa-selecao',
    typeLabel: 'Camisa de Seleção',
    selection: 'Portugal',
    brand: 'Heritage Kit',
    season: 'Edição Especial',
    sizes: ['M', 'G'],
    price: 459,
    installmentCount: 6,
    onSale: false,
    inStock: false,
    isBestSeller: false,
    isNew: true,
    createdAt: '2026-01-20',
  },
  {
    category: 'retro',
    categoryLabel: 'Retrô',
    type: 'camisa-retro',
    typeLabel: 'Camisa Retrô',
    team: 'Flamengo',
    brand: 'Heritage Kit',
    season: 'Retrô',
    sizes: ['M', 'G', 'GG'],
    price: 389,
    installmentCount: 5,
    onSale: false,
    inStock: true,
    isBestSeller: true,
    badge: 'Retrô',
    createdAt: '2025-04-15',
  },
  {
    category: 'retro',
    categoryLabel: 'Retrô',
    type: 'camisa-retro',
    typeLabel: 'Camisa Retrô',
    team: 'Corinthians',
    brand: 'Heritage Kit',
    season: 'Retrô',
    sizes: ['P', 'M', 'G'],
    price: 369,
    compareAtPrice: 429,
    installmentCount: 5,
    onSale: true,
    inStock: true,
    isBestSeller: false,
    discountPercent: 14,
    createdAt: '2025-03-01',
  },
  {
    category: 'casual-esportiva',
    categoryLabel: 'Casual Esportiva',
    type: 'casual-esportiva',
    typeLabel: 'Casual Esportiva',
    team: 'Flamengo',
    brand: 'Elite Sport',
    season: '2024/25',
    sizes: ['P', 'M', 'G', 'GG'],
    price: 249,
    installmentCount: 4,
    onSale: false,
    inStock: true,
    isBestSeller: false,
    isNew: true,
    createdAt: '2026-02-10',
  },
  {
    category: 'cuecas-boxer',
    categoryLabel: 'Cuecas & Boxer',
    type: 'boxer',
    typeLabel: 'Boxer',
    brand: 'Core Intimates',
    season: '2024/25',
    sizes: ['P', 'M', 'G', 'GG'],
    price: 89,
    compareAtPrice: 109,
    installmentCount: 2,
    onSale: true,
    inStock: true,
    isBestSeller: true,
    discountPercent: 18,
    createdAt: '2025-12-01',
  },
  {
    category: 'cuecas-boxer',
    categoryLabel: 'Cuecas & Boxer',
    type: 'cueca',
    typeLabel: 'Cueca',
    brand: 'Core Intimates',
    season: '2024/25',
    sizes: ['M', 'G', 'GG'],
    price: 79,
    installmentCount: 2,
    onSale: false,
    inStock: true,
    isBestSeller: false,
    createdAt: '2025-10-15',
  },
  {
    category: 'intimas-masculinas',
    categoryLabel: 'Íntimas Masculinas',
    type: 'intima-masculina',
    typeLabel: 'Íntima Masculina',
    brand: 'Core Intimates',
    season: '2024/25',
    sizes: ['P', 'M', 'G'],
    price: 129,
    installmentCount: 3,
    onSale: false,
    inStock: true,
    isBestSeller: false,
    isNew: true,
    createdAt: '2026-01-05',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildProductName(
  base: (typeof BASE_PRODUCTS)[0],
  index: number,
): string {
  const entity = base.team ?? base.selection ?? base.typeLabel;
  return `${entity} ${base.season} ${base.brand}${index > 12 ? ` ${index}` : ''}`.trim();
}

export const CATALOG_PRODUCTS: CatalogProduct[] = Array.from(
  { length: 36 },
  (_, i) => {
    const base = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
    const name = buildProductName(base, i + 1);
    const slug = slugify(name);
    return {
      ...base,
      id: `cat-${i + 1}`,
      name,
      slug,
      imageUrl: img(i + 1),
      imageAlt: name,
    };
  },
);

export function parseSearchParams(params: CatalogSearchParams): {
  query: string;
  sort: CatalogSortOption;
  page: number;
  filters: CatalogFilters;
} {
  return {
    query: params.q?.trim() ?? '',
    sort: (params.sort as CatalogSortOption) ?? 'best-sellers',
    page: Math.max(1, Number(params.page) || 1),
    filters: {
      categories: params.categories?.split(',').filter(Boolean) ?? [],
      types: params.types?.split(',').filter(Boolean) ?? [],
      teams: params.teams?.split(',').filter(Boolean) ?? [],
      selections: params.selections?.split(',').filter(Boolean) ?? [],
      brands: params.brands?.split(',').filter(Boolean) ?? [],
      seasons: params.seasons?.split(',').filter(Boolean) ?? [],
      sizes: params.sizes?.split(',').filter(Boolean) ?? [],
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      onSale: params.onSale === 'true' ? true : undefined,
      inStock: params.inStock === 'true' ? true : undefined,
    },
  };
}

export function searchProducts(
  products: CatalogProduct[],
  query: string,
): CatalogProduct[] {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.team?.toLowerCase().includes(q) ||
      p.selection?.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.typeLabel.toLowerCase().includes(q),
  );
}

export function applyFilters(
  products: CatalogProduct[],
  filters: CatalogFilters,
): CatalogProduct[] {
  return products.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.category))
      return false;
    if (filters.types.length && !filters.types.includes(p.type)) return false;
    if (filters.teams.length && (!p.team || !filters.teams.includes(p.team)))
      return false;
    if (
      filters.selections.length &&
      (!p.selection || !filters.selections.includes(p.selection))
    )
      return false;
    if (filters.brands.length && !filters.brands.includes(p.brand))
      return false;
    if (filters.seasons.length && !filters.seasons.includes(p.season))
      return false;
    if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s)))
      return false;
    if (filters.priceMin !== undefined && p.price < filters.priceMin)
      return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax)
      return false;
    if (filters.onSale === true && !p.onSale) return false;
    if (filters.inStock === true && !p.inStock) return false;
    return true;
  });
}

export function sortProducts(
  products: CatalogProduct[],
  sort: CatalogSortOption,
): CatalogProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'biggest-discount':
      return sorted.sort(
        (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0),
      );
    case 'best-sellers':
    default:
      return sorted.sort(
        (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller),
      );
  }
}

export function paginateProducts<T>(
  items: T[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
): { items: T[]; total: number; totalPages: number; page: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}

export function getProductsByCategorySlug(slug: string[]): CatalogProduct[] {
  if (!slug.length) return CATALOG_PRODUCTS;

  const [category, sub] = slug;
  let products = CATALOG_PRODUCTS.filter((p) => p.category === category);

  if (sub && CATALOG_SUBCATEGORY_TEAMS[sub]) {
    const teamName = CATALOG_SUBCATEGORY_TEAMS[sub];
    products = products.filter(
      (p) => p.team === teamName || p.selection === teamName,
    );
  }

  return products;
}

export function getCategoryMeta(slug: string[]) {
  const category = CATALOG_CATEGORIES.find((c) => c.slug === slug[0]);
  const subLabel = slug[1] ? CATALOG_SUBCATEGORY_TEAMS[slug[1]] : undefined;

  if (!category && !slug.length) {
    return {
      title: 'Catálogo',
      description: 'Explore todo o catálogo UNDER SELECT.',
    };
  }

  if (subLabel) {
    return {
      title: subLabel,
      description: `${category?.label ?? 'Catálogo'} — ${subLabel}. Peças premium com autenticidade e acabamento superior.`,
    };
  }

  return {
    title: category?.label ?? 'Catálogo',
    description:
      category?.description ?? 'Explore categorias premium UNDER SELECT.',
  };
}

export function getPromoProducts(): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((p) => p.onSale);
}

export function getNewProducts(): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((p) => p.isNew);
}

export function buildCategoryPath(slug: string[]): string {
  return slug.length ? `/categoria/${slug.join('/')}` : '/categoria';
}

export function buildCategoryBreadcrumbs(slug: string[]) {
  const crumbs: { label: string; href?: `/${string}` | '/' }[] = [
    { label: 'Início', href: '/' },
    { label: 'Catálogo', href: '/categoria' },
  ];

  if (slug[0]) {
    const cat = CATALOG_CATEGORIES.find((c) => c.slug === slug[0]);
    crumbs.push({
      label: cat?.label ?? slug[0],
      href: `/categoria/${slug[0]}` as `/${string}`,
    });
  }

  if (slug[1]) {
    crumbs.push({
      label: CATALOG_SUBCATEGORY_TEAMS[slug[1]] ?? slug[1],
    });
  }

  return crumbs;
}

export function processCatalog(
  products: CatalogProduct[],
  params: CatalogSearchParams,
  presetFilters?: Partial<CatalogFilters>,
) {
  const parsed = parseSearchParams(params);
  const mergedFilters: CatalogFilters = {
    ...parsed.filters,
    categories: [
      ...new Set([
        ...(presetFilters?.categories ?? []),
        ...parsed.filters.categories,
      ]),
    ],
    onSale:
      presetFilters?.onSale !== undefined
        ? presetFilters.onSale
        : parsed.filters.onSale,
    inStock: parsed.filters.inStock,
  };

  let result = products;
  result = searchProducts(result, parsed.query);
  result = applyFilters(result, mergedFilters);
  result = sortProducts(result, parsed.sort);
  const paginated = paginateProducts(result, parsed.page);

  return {
    ...paginated,
    sort: parsed.sort,
    query: parsed.query,
    filters: mergedFilters,
  };
}
