import type { ProductCardData } from '@presentation/components/product';
import type {
  HomeBenefitData,
  HomeCategoryData,
  HomeHeroCrest,
  HomeHeroData,
  HomePromotionData,
} from '@shared/types/home.types';

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
    imageUrl: '/images/clubs/flamengo.svg',
    imageAlt: 'Clubes brasileiros',
  },
  {
    id: 'selecoes',
    name: 'Seleções',
    description: 'Brasil, Argentina, Portugal e outras',
    href: '/categoria/selecoes',
    imageUrl: '/images/nations/brasil.svg',
    imageAlt: 'Seleções nacionais',
  },
  {
    id: 'retro',
    name: 'Retrô',
    description: 'Clássicos que marcaram gerações',
    href: '/categoria/retro',
    imageUrl: '/images/clubs/corinthians.svg',
    imageAlt: 'Camisas retrô',
  },
  {
    id: 'casual-esportiva',
    name: 'Casual Esportiva',
    description: 'Estilo lifestyle com identidade esportiva',
    href: '/categoria/casual-esportiva',
    imageUrl: '/images/clubs/real-madrid.svg',
    imageAlt: 'Casual esportiva',
  },
];

export const HOME_FEATURED_PRODUCTS: ProductCardData[] = [];
export const HOME_NEW_ARRIVALS: ProductCardData[] = [];

export const HOME_PROMOTIONS: HomePromotionData[] = [
  {
    id: 'promo-1',
    title: 'Clubes brasileiros',
    subtitle: 'Flamengo, Corinthians, Palmeiras e os maiores do Brasil',
    badge: 'Destaque',
    href: '/categoria/clubes-brasileiros',
    imageUrl: '/images/clubs/flamengo.svg',
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
    imageUrl: '/images/nations/brasil.svg',
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

export const HOME_INSTITUTIONAL = {
  eyebrow: 'UNDER SELECT',
  title: 'Paixão com autenticidade',
  description:
    'Somos especialistas em camisas de times e seleções. Curamos peças licenciadas, com tecido de alta performance e acabamento superior — para quem leva o manto a sério, dentro e fora do estádio.',
  cta: { label: 'Explorar catálogo', href: '/categoria' as const },
  imageUrl: '/images/home/logo-underselect.jpg',
  imageAlt: 'Logo UNDER SELECT',
};
