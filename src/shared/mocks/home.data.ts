import type { Route } from 'next';

import type { ProductCardData } from '@presentation/components/product';

export interface HomeHeroData {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: Route | string };
  ctaSecondary: { label: string; href: Route | string };
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
}

export interface HomeBenefitData {
  id: string;
  title: string;
  description: string;
}

export interface HomeInstitutionalData {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: Route | string };
  imageUrl: string;
  imageAlt: string;
}

export const HOME_HERO: HomeHeroData = {
  eyebrow: 'Coleção Outono · Inverno 2026',
  title: 'Elegância em cada detalhe',
  subtitle:
    'Peças atemporais com corte impecável e materiais selecionados. Luxo discreto para o guarda-roupa contemporâneo.',
  ctaPrimary: { label: 'Explorar coleção', href: '/categoria' },
  ctaSecondary: { label: 'Novidades', href: '/categoria' },
  imageUrl: '/images/home/hero.svg',
  imageAlt: 'Modelo usando look premium UNDER SELECT',
};

export const HOME_CATEGORIES: HomeCategoryData[] = [
  {
    id: 'feminino',
    name: 'Feminino',
    description: 'Silhuetas refinadas',
    href: '/categoria',
    imageUrl: '/images/home/category-feminino.svg',
    imageAlt: 'Categoria Feminino',
  },
  {
    id: 'masculino',
    name: 'Masculino',
    description: 'Essencialismo moderno',
    href: '/categoria',
    imageUrl: '/images/home/category-masculino.svg',
    imageAlt: 'Categoria Masculino',
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    description: 'Detalhes que definem',
    href: '/categoria',
    imageUrl: '/images/home/category-acessorios.svg',
    imageAlt: 'Categoria Acessórios',
  },
  {
    id: 'novidades',
    name: 'Novidades',
    description: 'Lançamentos exclusivos',
    href: '/categoria',
    imageUrl: '/images/home/category-novidades.svg',
    imageAlt: 'Categoria Novidades',
  },
];

export const HOME_FEATURED_PRODUCTS: ProductCardData[] = [
  {
    id: 'f1',
    name: 'Blazer Estruturado Lã',
    slug: 'blazer-estruturado-la',
    price: 1890,
    imageUrl: '/images/home/product-1.svg',
    imageAlt: 'Blazer Estruturado Lã',
    badge: 'Destaque',
  },
  {
    id: 'f2',
    name: 'Vestido Midi Seda',
    slug: 'vestido-midi-seda',
    price: 2490,
    compareAtPrice: 2790,
    imageUrl: '/images/home/product-2.svg',
    imageAlt: 'Vestido Midi Seda',
  },
  {
    id: 'f3',
    name: 'Camisa Algodão Egípcio',
    slug: 'camisa-algodao-egipcio',
    price: 690,
    imageUrl: '/images/home/product-3.svg',
    imageAlt: 'Camisa Algodão Egípcio',
  },
  {
    id: 'f4',
    name: 'Casaco Cashmere',
    slug: 'casaco-cashmere',
    price: 3290,
    imageUrl: '/images/home/product-4.svg',
    imageAlt: 'Casaco Cashmere',
    badge: 'Exclusivo',
  },
];

export const HOME_NEW_ARRIVALS: ProductCardData[] = [
  {
    id: 'n1',
    name: 'Calça Wide Leg Linho',
    slug: 'calca-wide-leg-linho',
    price: 890,
    imageUrl: '/images/home/product-5.svg',
    imageAlt: 'Calça Wide Leg Linho',
    isNew: true,
  },
  {
    id: 'n2',
    name: 'Bolsa Couro Italiano',
    slug: 'bolsa-couro-italiano',
    price: 2190,
    imageUrl: '/images/home/product-6.svg',
    imageAlt: 'Bolsa Couro Italiano',
    isNew: true,
  },
  {
    id: 'n3',
    name: 'Trench Coat Clássico',
    slug: 'trench-coat-classico',
    price: 2790,
    imageUrl: '/images/home/product-7.svg',
    imageAlt: 'Trench Coat Clássico',
    isNew: true,
  },
  {
    id: 'n4',
    name: 'Óculos Acetato',
    slug: 'oculos-acetato',
    price: 990,
    imageUrl: '/images/home/product-8.svg',
    imageAlt: 'Óculos Acetato',
    isNew: true,
  },
];

export const HOME_PROMOTIONS: HomePromotionData[] = [
  {
    id: 'promo-1',
    title: 'Até 30% off',
    subtitle: 'Seleção curada de peças da temporada anterior',
    badge: 'Promoção',
    href: '/categoria',
    imageUrl: '/images/home/promo-1.svg',
    imageAlt: 'Promoção seleção curada',
  },
  {
    id: 'promo-2',
    title: 'Frete expresso grátis',
    subtitle: 'Em compras acima de R$ 599 para todo o Brasil',
    href: '/categoria',
    imageUrl: '/images/home/promo-2.svg',
    imageAlt: 'Frete expresso grátis',
  },
];

export const HOME_INSTITUTIONAL: HomeInstitutionalData = {
  eyebrow: 'A marca',
  title: 'Crafted with intention',
  description:
    'Na UNDER SELECT, cada peça nasce de um processo cuidadoso de curadoria. Trabalhamos com ateliês selecionados, materiais nobres e design atemporal — porque luxo verdadeiro não precisa gritar.',
  cta: { label: 'Conheça nossa história', href: '/contato' },
  imageUrl: '/images/home/institutional.svg',
  imageAlt: 'Atelier UNDER SELECT',
};

export const HOME_BENEFITS: HomeBenefitData[] = [
  {
    id: 'shipping',
    title: 'Frete premium',
    description: 'Entrega rastreada com embalagem exclusiva.',
  },
  {
    id: 'returns',
    title: 'Trocas facilitadas',
    description: '30 dias para trocas e devoluções sem burocracia.',
  },
  {
    id: 'payment',
    title: 'Parcelamento',
    description: 'Até 6x sem juros nos cartões participantes.',
  },
  {
    id: 'service',
    title: 'Atendimento VIP',
    description: 'Consultoria de estilo personalizada online.',
  },
];
