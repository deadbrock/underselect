import type {
  CatalogFilters,
  CatalogSearchParams,
  CatalogSortOption,
} from '@shared/types/catalog.types';

export function countActiveFilters(filters: CatalogFilters): number {
  let count = 0;
  count += filters.categories.length;
  count += filters.types.length;
  count += filters.teams.length;
  count += filters.selections.length;
  count += filters.brands.length;
  count += filters.seasons.length;
  count += filters.sizes.length;
  if (filters.priceMin !== undefined) count += 1;
  if (filters.priceMax !== undefined) count += 1;
  if (filters.onSale === true) count += 1;
  if (filters.inStock === true) count += 1;
  return count;
}

export function filtersToParams(
  filters: CatalogFilters,
  sort: CatalogSortOption,
  page: number,
  query?: string,
): CatalogSearchParams {
  const params: CatalogSearchParams = { sort, page: String(page) };
  if (query) params.q = query;
  if (filters.categories.length)
    params.categories = filters.categories.join(',');
  if (filters.types.length) params.types = filters.types.join(',');
  if (filters.teams.length) params.teams = filters.teams.join(',');
  if (filters.selections.length)
    params.selections = filters.selections.join(',');
  if (filters.brands.length) params.brands = filters.brands.join(',');
  if (filters.seasons.length) params.seasons = filters.seasons.join(',');
  if (filters.sizes.length) params.sizes = filters.sizes.join(',');
  if (filters.priceMin !== undefined)
    params.priceMin = String(filters.priceMin);
  if (filters.priceMax !== undefined)
    params.priceMax = String(filters.priceMax);
  if (filters.onSale === true) params.onSale = 'true';
  if (filters.inStock === true) params.inStock = 'true';
  return params;
}

export function paramsToQueryString(params: CatalogSearchParams): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') sp.set(key, value);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export function getEmptyVariant(
  query: string,
  filterCount: number,
): 'search' | 'category' | 'filters' {
  if (query) return 'search';
  if (filterCount > 0) return 'filters';
  return 'category';
}

export const EMPTY_FILTERS: CatalogFilters = {
  categories: [],
  types: [],
  teams: [],
  selections: [],
  brands: [],
  seasons: [],
  sizes: [],
};
