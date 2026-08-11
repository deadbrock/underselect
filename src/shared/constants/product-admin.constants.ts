import type {
  AdminProductSortOption,
  AdminProductStatus,
} from '@shared/types/product-admin.types';

export const PRODUCT_STORAGE_KEY = 'underselect-admin-products';

export const ADMIN_PRODUCT_COLLECTIONS = [
  'Verão 2026',
  'Brasileirão 2026',
  'Seleções Copa',
  'Premium Match',
  'Retrô Classics',
  'Core Intimates',
] as const;

export const ADMIN_PRODUCT_TAGS = [
  'Oficial',
  'Licenciado',
  'Edição Limitada',
  'Match Day',
  'Treino',
  'Goleiro',
  'Feminino',
  'Infantil',
] as const;

export const ADMIN_PRODUCT_SORT_LABELS: Record<AdminProductSortOption, string> =
  {
    'name-asc': 'Nome A–Z',
    'name-desc': 'Nome Z–A',
    'price-asc': 'Menor preço',
    'price-desc': 'Maior preço',
    'stock-asc': 'Menor estoque',
    'stock-desc': 'Maior estoque',
    newest: 'Mais recentes',
    oldest: 'Mais antigos',
  };

export const ADMIN_PRODUCT_STATUS_LABELS: Record<AdminProductStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  draft: 'Rascunho',
  archived: 'Arquivado',
};

export const ADMIN_PRODUCT_PAGE_SIZE = 12;

export const PRODUCT_CLOTHING_SIZES = [
  'PP',
  'P',
  'M',
  'G',
  'GG',
  'XG',
  'XXG',
  '3G',
] as const;
