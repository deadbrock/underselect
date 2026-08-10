import type { Route } from 'next';

import type { ProductCardData } from '@presentation/components/product';
import type { CatalogProduct } from './catalog.types';
import { CATALOG_PRODUCTS } from './catalog.utils';

export interface HomeHeroData {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: Route | string };
  ctaSecondary: { label: string; href: Route | string };
}

export interface HomeHeroCrest {
  id: string;
  label: string;
  imageUrl: string;
  imageAlt: string;
}

export interface HomeCategoryData {
  id: string;
  name: string;
  description: string;
  href: Route | string;
  imageUrl: string;
  imageAlt: string;
}

export interface HomePromotionData {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  href: Route | string;
  imageUrl: string;
  imageAlt: string;
  flags?: HomePromotionFlag[];
  flagDisplay?: 'banner' | 'crest';
  highlightGradient?: string;
}

export interface HomePromotionFlag {
  id: string;
  label: string;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
}

export interface HomeBenefitData {
  id: string;
  title: string;
  description: string;
}

export const HOME_HERO: HomeHeroData = {
  eyebrow: 'Temporada 2024/25',
  title: 'Vista a camisa do seu time',
  subtitle:
    'Camisas oficiais de clubes brasileiros, seleções nacionais e edições retrô. Acabamento premium, tecido de performance e identidade de torcedor.',
  ctaPrimary: {
    label: 'Ver clubes brasileiros',
    href: '/categoria/clubes-brasileiros',
  },
  ctaSecondary: { label: 'Seleções', href: '/categoria/selecoes' },
};

export const HOME_HERO_CRESTS: HomeHeroCrest[] = [
  {
    id: 'palmeiras',
    label: 'Palmeiras',
    imageUrl: '/images/clubs/palmeiras.svg',
    imageAlt: 'Escudo do Palmeiras',
  },
  {
    id: 'corinthians',
    label: 'Sport Club Corinthians Paulista',
    imageUrl: '/images/clubs/corinthians.svg',
    imageAlt: 'Escudo do Sport Club Corinthians Paulista',
  },
  {
    id: 'flamengo',
    label: 'Clube de Regatas do Flamengo',
    imageUrl: '/images/clubs/flamengo.svg',
    imageAlt: 'Escudo do Clube de Regatas do Flamengo',
  },
  {
    id: 'vasco',
    label: 'Vasco da Gama',
    imageUrl: '/images/clubs/vasco.svg',
    imageAlt: 'Escudo do Vasco da Gama',
  },
  {
    id: 'cruzeiro',
    label: 'Cruzeiro',
    imageUrl: '/images/clubs/cruzeiro.svg',
    imageAlt: 'Escudo do Cruzeiro',
  },
  {
    id: 'real-madrid',
    label: 'Real Madrid',
    imageUrl: '/images/clubs/real-madrid.svg',
    imageAlt: 'Escudo do Real Madrid',
  },
  {
    id: 'barcelona',
    label: 'Barcelona',
    imageUrl: '/images/clubs/barcelona.svg',
    imageAlt: 'Escudo do Barcelona',
  },
  {
    id: 'arsenal',
    label: 'Arsenal',
    imageUrl: '/images/clubs/arsenal.svg',
    imageAlt: 'Escudo do Arsenal',
  },
  {
    id: 'chelsea',
    label: 'Chelsea',
    imageUrl: '/images/clubs/chelsea.svg',
    imageAlt: 'Escudo do Chelsea',
  },
  {
    id: 'brasil',
    label: 'Brasil',
    imageUrl: '/images/nations/brasil.svg',
    imageAlt: 'Escudo da Seleção Brasileira',
  },
  {
    id: 'argentina',
    label: 'Argentina',
    imageUrl: '/images/nations/argentina.svg',
    imageAlt: 'Escudo da Seleção Argentina',
  },
  {
    id: 'estados-unidos',
    label: 'Estados Unidos',
    imageUrl: '/images/nations/estados-unidos.svg',
    imageAlt: 'Escudo da Seleção dos Estados Unidos',
  },
  {
    id: 'portugal',
    label: 'Portugal',
    imageUrl: '/images/nations/portugal.svg',
    imageAlt: 'Escudo da Seleção Portuguesa',
  },
  {
    id: 'espanha',
    label: 'Espanha',
    imageUrl: '/images/nations/espanha.svg',
    imageAlt: 'Escudo da Seleção Espanhola',
  },
  {
    id: 'inglaterra',
    label: 'Inglaterra',
    imageUrl: '/images/nations/inglaterra.svg',
    imageAlt: 'Escudo da Seleção Inglesa',
  },
  {
    id: 'italia',
    label: 'Itália',
    imageUrl: '/images/nations/italia.svg',
    imageAlt: 'Escudo da Seleção Italiana',
  },
  {
    id: 'alemanha',
    label: 'Alemanha',
    imageUrl: '/images/nations/alemanha.svg',
    imageAlt: 'Escudo da Seleção Alemã',
  },
  {
    id: 'franca',
    label: 'França',
    imageUrl: '/images/nations/franca.svg',
    imageAlt: 'Escudo da Seleção Francesa',
  },
];

export const HOME_CATEGORIES: HomeCategoryData[] = [
  {
    id: 'clubes-brasileiros',
    name: 'Clubes Brasileiros',
    description: 'Flamengo, Palmeiras, Corinthians e mais',
    href: '/categoria/clubes-brasileiros',
    imageUrl: '/images/catalog/product-1.svg',
    imageAlt: 'Camisas de clubes brasileiros',
  },
  {
    id: 'selecoes',
    name: 'Seleções',
    description: 'Brasil, Argentina, Portugal e outras',
    href: '/categoria/selecoes',
    imageUrl: '/images/catalog/product-2.svg',
    imageAlt: 'Camisas de seleções nacionais',
  },
  {
    id: 'retro',
    name: 'Retrô',
    description: 'Clássicos que marcaram gerações',
    href: '/categoria/retro',
    imageUrl: '/images/catalog/product-3.svg',
    imageAlt: 'Camisas retrô',
  },
  {
    id: 'casual-esportiva',
    name: 'Casual Esportiva',
    description: 'Estilo lifestyle com identidade esportiva',
    href: '/categoria/casual-esportiva',
    imageUrl: '/images/catalog/product-4.svg',
    imageAlt: 'Casual esportiva',
  },
];

const SHIRT_TYPES = new Set([
  'camisa-clube',
  'camisa-selecao',
  'camisa-retro',
  'casual-esportiva',
]);

function toProductCard(product: CatalogProduct): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    badge: product.badge,
    isNew: product.isNew,
  };
}

export const HOME_FEATURED_PRODUCTS: ProductCardData[] =
  CATALOG_PRODUCTS.filter((p) => p.isBestSeller && SHIRT_TYPES.has(p.type))
    .slice(0, 4)
    .map(toProductCard);

export const HOME_NEW_ARRIVALS: ProductCardData[] = CATALOG_PRODUCTS.filter(
  (p) => p.isNew && SHIRT_TYPES.has(p.type),
)
  .slice(0, 4)
  .map(toProductCard);

export const HOME_PROMOTIONS: HomePromotionData[] = [
  {
    id: 'promo-1',
    title: 'Clubes brasileiros',
    subtitle: 'Flamengo, Corinthians, Palmeiras e os maiores do Brasil',
    badge: 'Destaque',
    href: '/categoria/clubes-brasileiros',
    imageUrl: '/images/catalog/product-5.svg',
    imageAlt: 'Promoção camisas de clubes brasileiros',
    flagDisplay: 'crest',
    highlightGradient: 'from-red-900/50 via-black/70 to-green-900/45',
    flags: [
      {
        id: 'flamengo',
        label: 'Flamengo',
        imageUrl: '/images/clubs/flamengo.svg',
        imageAlt: 'Escudo do Flamengo',
      },
      {
        id: 'corinthians',
        label: 'Corinthians',
        imageUrl: '/images/clubs/corinthians.svg',
        imageAlt: 'Escudo do Corinthians',
        featured: true,
      },
      {
        id: 'palmeiras',
        label: 'Palmeiras',
        imageUrl: '/images/clubs/palmeiras.svg',
        imageAlt: 'Escudo do Palmeiras',
      },
    ],
  },
  {
    id: 'promo-2',
    title: 'Seleções nacionais',
    subtitle: 'Brasil, Argentina, Portugal e edições limitadas',
    href: '/categoria/selecoes',
    imageUrl: '/images/catalog/product-6.svg',
    imageAlt: 'Camisas de seleções nacionais',
    flagDisplay: 'banner',
    highlightGradient: 'from-[#002776]/40 via-black/60 to-[#006600]/30',
    flags: [
      {
        id: 'argentina',
        label: 'Argentina',
        imageUrl: '/images/flags/argentina.svg',
        imageAlt: 'Bandeira da Argentina',
      },
      {
        id: 'brasil',
        label: 'Brasil',
        imageUrl: '/images/flags/brasil.svg',
        imageAlt: 'Bandeira do Brasil',
        featured: true,
      },
      {
        id: 'portugal',
        label: 'Portugal',
        imageUrl: '/images/flags/portugal.svg',
        imageAlt: 'Bandeira de Portugal',
      },
    ],
  },
];

export const HOME_BENEFITS: HomeBenefitData[] = [
  {
    id: 'returns',
    title: 'Troca de tamanho',
    description: 'Facilidade para trocar camisas que não serviram.',
  },
  {
    id: 'payment',
    title: 'Parcelamento',
    description: 'Até 2x sem juros.',
  },
];
