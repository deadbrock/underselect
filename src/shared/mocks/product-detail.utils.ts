import { CATALOG_SUBCATEGORY_TEAMS } from './catalog.constants';
import type { CatalogProduct } from './catalog.types';
import { CATALOG_PRODUCTS } from './catalog.utils';
import type {
  ProductDetail,
  ProductRelatedGroups,
  ProductReviews,
} from './product-detail.types';

const img = (n: number) => `/images/catalog/product-${((n - 1) % 12) + 1}.svg`;

const SHIRT_TYPES = new Set([
  'camisa-clube',
  'camisa-selecao',
  'camisa-retro',
  'casual-esportiva',
]);

const REVIEW_AUTHORS = [
  'Rafael M.',
  'Lucas S.',
  'Bruno A.',
  'Diego F.',
  'Marcos P.',
  'Thiago R.',
];

const REVIEW_TEXTS = [
  'Qualidade excepcional. Tecido premium e caimento impecável.',
  'Entrega rápida e produto fiel às fotos. Recomendo.',
  'Acabamento superior. Já é minha terceira compra na UNDER SELECT.',
  'Tamanho conforme a tabela. Material confortável e respirável.',
  'Presente perfeito. Embalagem elegante e produto autêntico.',
];

function teamSlug(team: string): string | undefined {
  return Object.entries(CATALOG_SUBCATEGORY_TEAMS).find(
    ([, name]) => name === team,
  )?.[0];
}

function buildImages(
  product: CatalogProduct,
  index: number,
): ProductDetail['images'] {
  const base = (index % 12) + 1;
  return Array.from({ length: 4 }, (_, i) => ({
    url: img(base + i),
    alt: `${product.name} — imagem ${i + 1}`,
  }));
}

function buildColors(product: CatalogProduct): ProductDetail['colors'] {
  if (!SHIRT_TYPES.has(product.type)) {
    return [
      { id: 'preto', label: 'Preto', hex: '#1a1a1a' },
      { id: 'cinza', label: 'Cinza', hex: '#6b7280' },
      { id: 'branco', label: 'Branco', hex: '#f5f5f5' },
    ];
  }

  return [
    { id: 'principal', label: 'Principal', hex: '#b91c1c' },
    { id: 'alternativa', label: 'Alternativa', hex: '#1e3a5f' },
    {
      id: 'terceira',
      label: 'Terceira',
      hex: '#fbbf24',
      disabled: !product.inStock,
    },
  ];
}

function buildModels(product: CatalogProduct): ProductDetail['models'] {
  if (product.type === 'camisa-retro') {
    return [
      { id: 'retro', label: 'Retrô' },
      { id: 'torcedor', label: 'Torcedor', disabled: true },
      { id: 'jogador', label: 'Jogador', disabled: true },
    ];
  }

  if (SHIRT_TYPES.has(product.type)) {
    return [
      { id: 'torcedor', label: 'Torcedor' },
      { id: 'jogador', label: 'Jogador' },
      {
        id: 'retro',
        label: 'Retrô',
        disabled: product.type !== 'camisa-clube',
      },
    ];
  }

  return [
    { id: 'standard', label: 'Standard' },
    { id: 'comfort', label: 'Comfort' },
  ];
}

function buildUnavailableSizes(product: CatalogProduct): string[] {
  if (product.sizes.length <= 1) return [];
  return [product.sizes[product.sizes.length - 1]!];
}

function buildDescription(product: CatalogProduct): string {
  const entity = product.team ?? product.selection ?? product.typeLabel;
  return `${product.name} faz parte da coleção ${product.season} da UNDER SELECT. Peça desenvolvida para ${entity}, com tecido de alta performance, respirabilidade e acabamento premium. Ideal para torcedores exigentes que valorizam autenticidade e conforto.`;
}

function buildSpecifications(
  product: CatalogProduct,
): ProductDetail['specifications'] {
  const base = [
    { label: 'Material', value: 'Poliéster reciclado de alta performance' },
    { label: 'Composição', value: '100% poliéster' },
    { label: 'Tecnologia', value: 'Dry-Fit · Anti-odor' },
    { label: 'Origem', value: 'Produção licenciada' },
    { label: 'Marca', value: product.brand },
    { label: 'Temporada', value: product.season },
  ];

  if (product.team) base.unshift({ label: 'Time', value: product.team });
  if (product.selection)
    base.unshift({ label: 'Seleção', value: product.selection });

  return base;
}

function buildSizeChart(product: CatalogProduct): ProductDetail['sizeChart'] {
  const rows: Record<string, { chest: string; length: string }> = {
    P: { chest: '96 cm', length: '70 cm' },
    M: { chest: '102 cm', length: '72 cm' },
    G: { chest: '108 cm', length: '74 cm' },
    GG: { chest: '114 cm', length: '76 cm' },
    XG: { chest: '120 cm', length: '78 cm' },
  };

  return product.sizes.map((size) => ({
    size,
    chest: rows[size]?.chest ?? '—',
    length: rows[size]?.length ?? '—',
  }));
}

function buildReviews(product: CatalogProduct, seed: number): ProductReviews {
  const averageRating = product.isBestSeller ? 4.8 : 4.5 + (seed % 3) * 0.1;
  const totalCount = 48 + seed * 7;
  const distribution = [
    { stars: 5, count: Math.round(totalCount * 0.72) },
    { stars: 4, count: Math.round(totalCount * 0.18) },
    { stars: 3, count: Math.round(totalCount * 0.06) },
    { stars: 2, count: Math.round(totalCount * 0.03) },
    { stars: 1, count: Math.round(totalCount * 0.01) },
  ];

  const comments = Array.from({ length: 4 }, (_, i) => ({
    id: `rev-${product.id}-${i}`,
    author: REVIEW_AUTHORS[(seed + i) % REVIEW_AUTHORS.length]!,
    rating: i === 0 ? 5 : 4 + (i % 2),
    date: `2025-${String(10 + i).padStart(2, '0')}-15`,
    text: REVIEW_TEXTS[(seed + i) % REVIEW_TEXTS.length]!,
    verified: i % 2 === 0,
  }));

  return {
    averageRating,
    totalCount,
    distribution,
    comments,
    customerPhotosReady: true,
  };
}

function buildFaq(customizationAvailable: boolean): ProductDetail['faq'] {
  return [
    {
      question: 'O produto é original/licenciado?',
      answer:
        'Sim. Todos os produtos UNDER SELECT possuem licenciamento oficial e passam por controle de qualidade.',
    },
    {
      question: 'Como escolher o tamanho correto?',
      answer:
        'Consulte a tabela de medidas na aba correspondente. Em caso de dúvida, opte pelo tamanho superior.',
    },
    {
      question: 'Posso personalizar com nome e número?',
      answer: customizationAvailable
        ? 'Sim. A personalização estará disponível na próxima fase de integração com o checkout.'
        : 'Personalização disponível apenas para camisas de clubes e seleções.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'Entrega estimada em 5 a 8 dias úteis para produtos em estoque.',
    },
  ];
}

export function enrichProductDetail(
  product: CatalogProduct,
  index: number,
): ProductDetail {
  const seed = index + 1;
  const customizationAvailable = SHIRT_TYPES.has(product.type);

  return {
    ...product,
    sku: `US-${product.id.toUpperCase().replace('CAT-', '')}`,
    collection: `${product.season} · ${product.brand}`,
    images: buildImages(product, index),
    colors: buildColors(product),
    models: buildModels(product),
    unavailableSizes: buildUnavailableSizes(product),
    description: buildDescription(product),
    specifications: buildSpecifications(product),
    sizeChart: buildSizeChart(product),
    returnsPolicy:
      'Você tem até 30 dias para solicitar troca ou devolução. A peça deve estar sem uso, com etiquetas e embalagem original. Troca facilitada em todo o Brasil.',
    faq: buildFaq(customizationAvailable),
    reviews: buildReviews(product, seed),
    estimatedDelivery: product.inStock
      ? 'Receba entre 5 e 8 dias úteis'
      : 'Indisponível no momento',
    customizationAvailable,
  };
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  const index = CATALOG_PRODUCTS.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  return enrichProductDetail(CATALOG_PRODUCTS[index]!, index);
}

export function getAllProductSlugs(): string[] {
  return CATALOG_PRODUCTS.map((p) => p.slug);
}

export function buildProductBreadcrumbs(product: CatalogProduct) {
  const crumbs: { label: string; href?: `/${string}` | '/' }[] = [
    { label: 'Início', href: '/' },
    { label: 'Catálogo', href: '/categoria' },
    {
      label: product.categoryLabel,
      href: `/categoria/${product.category}` as `/${string}`,
    },
  ];

  const entity = product.team ?? product.selection;
  if (entity) {
    const sub = teamSlug(entity);
    if (sub) {
      crumbs.push({
        label: entity,
        href: `/categoria/${product.category}/${sub}` as `/${string}`,
      });
    } else {
      crumbs.push({ label: entity });
    }
  }

  crumbs.push({ label: product.name });
  return crumbs;
}

export function getRelatedProducts(
  product: CatalogProduct,
): ProductRelatedGroups {
  const exclude = (p: CatalogProduct) => p.id !== product.id;

  const similar = CATALOG_PRODUCTS.filter(
    (p) => exclude(p) && p.type === product.type,
  ).slice(0, 4);

  const alsoBought = CATALOG_PRODUCTS.filter(
    (p) => exclude(p) && p.category === product.category && p.isBestSeller,
  ).slice(0, 4);

  const sameCollection = CATALOG_PRODUCTS.filter(
    (p) =>
      exclude(p) && p.season === product.season && p.brand === product.brand,
  ).slice(0, 4);

  return {
    similar: similar.length
      ? similar
      : CATALOG_PRODUCTS.filter(exclude).slice(0, 4),
    alsoBought: alsoBought.length
      ? alsoBought
      : CATALOG_PRODUCTS.filter(exclude).slice(4, 8),
    sameCollection: sameCollection.length
      ? sameCollection
      : CATALOG_PRODUCTS.filter(
          (p) => exclude(p) && p.category === product.category,
        ).slice(0, 4),
  };
}
