import type { CatalogCategorySlug, CatalogProductType } from './catalog.types';

export const CATALOG_CATEGORIES: {
  slug: CatalogCategorySlug;
  label: string;
  description: string;
}[] = [
  {
    slug: 'clubes-brasileiros',
    label: 'Clubes Brasileiros',
    description:
      'Camisas oficiais e licenciadas dos principais clubes do Brasil.',
  },
  {
    slug: 'selecoes',
    label: 'Seleções',
    description: 'Uniformes de seleções nacionais e edições especiais.',
  },
  {
    slug: 'retro',
    label: 'Retrô',
    description: 'Camisas clássicas que marcaram gerações.',
  },
  {
    slug: 'casual-esportiva',
    label: 'Casual Esportiva',
    description: 'Peças lifestyle com identidade esportiva.',
  },
  {
    slug: 'cuecas-boxer',
    label: 'Cuecas & Boxer',
    description: 'Conforto premium para o dia a dia.',
  },
  {
    slug: 'intimas-masculinas',
    label: 'Íntimas Masculinas',
    description: 'Linha íntima com tecidos de alta performance.',
  },
];

export const CATALOG_TYPES: { value: CatalogProductType; label: string }[] = [
  { value: 'camisa-clube', label: 'Camisa de Clube' },
  { value: 'camisa-selecao', label: 'Camisa de Seleção' },
  { value: 'camisa-retro', label: 'Camisa Retrô' },
  { value: 'casual-esportiva', label: 'Casual Esportiva' },
  { value: 'cueca', label: 'Cueca' },
  { value: 'boxer', label: 'Boxer' },
  { value: 'intima-masculina', label: 'Íntima Masculina' },
];

export const CATALOG_TEAMS = [
  'Flamengo',
  'Corinthians',
  'Palmeiras',
  'São Paulo',
  'Grêmio',
  'Internacional',
  'Fluminense',
  'Botafogo',
  'Santos',
  'Atlético-MG',
  'Cruzeiro',
  'Vasco',
];

export const CATALOG_SELECTIONS = [
  'Brasil',
  'Argentina',
  'Portugal',
  'França',
  'Alemanha',
  'Itália',
  'Espanha',
  'Inglaterra',
];

export const CATALOG_BRANDS = [
  'UNDER SELECT',
  'Premium Match',
  'Heritage Kit',
  'Elite Sport',
  'Core Intimates',
];

export const CATALOG_SEASONS = [
  '2024/25',
  '2023/24',
  '2022/23',
  'Retrô',
  'Edição Especial',
];

export const CATALOG_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

export const CATALOG_PRICE_RANGE = { min: 49, max: 899 };

export const CATALOG_SUBCATEGORY_TEAMS: Record<string, string> = {
  flamengo: 'Flamengo',
  corinthians: 'Corinthians',
  palmeiras: 'Palmeiras',
  'sao-paulo': 'São Paulo',
  gremio: 'Grêmio',
  brasil: 'Brasil',
  argentina: 'Argentina',
  portugal: 'Portugal',
};

export const CATALOG_SUBCATEGORY_LABELS: Record<string, string> = {
  ...CATALOG_SUBCATEGORY_TEAMS,
};
