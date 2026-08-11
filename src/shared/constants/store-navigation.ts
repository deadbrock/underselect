import type { Route } from 'next';

export interface NavLink {
  label: string;
  href: Route | string;
}

export interface NavCategory extends NavLink {
  children?: NavLink[];
}

export const STORE_NAME = 'UNDER SELECT';

export const STORE_LOGO = {
  src: '/images/home/logo-underselect.jpg',
  alt: 'UNDER SELECT',
  width: 400,
  height: 172,
} as const;

export const PROMO_BAR = {
  enabled: false,
  message:
    'Frete grátis em compras acima de R$ 599 · Parcele em até 6x sem juros',
  href: '/promocoes' as Route,
};

export const MAIN_NAV: NavCategory[] = [
  {
    label: 'Novidades',
    href: '/novidades',
    children: [
      { label: 'Lançamentos', href: '/novidades' },
      { label: 'Clubes', href: '/categoria/clubes-brasileiros' },
      { label: 'Seleções', href: '/categoria/selecoes' },
    ],
  },
  {
    label: 'Clubes',
    href: '/categoria/clubes-brasileiros',
    children: [
      { label: 'Flamengo', href: '/categoria/clubes-brasileiros/flamengo' },
      {
        label: 'Corinthians',
        href: '/categoria/clubes-brasileiros/corinthians',
      },
      { label: 'Palmeiras', href: '/categoria/clubes-brasileiros/palmeiras' },
      { label: 'Ver todos', href: '/categoria/clubes-brasileiros' },
    ],
  },
  {
    label: 'Seleções',
    href: '/categoria/selecoes',
    children: [
      { label: 'Brasil', href: '/categoria/selecoes/brasil' },
      { label: 'Argentina', href: '/categoria/selecoes' },
      { label: 'Portugal', href: '/categoria/selecoes' },
    ],
  },
  {
    label: 'Retrô',
    href: '/categoria/retro',
    children: [
      { label: 'Clubes', href: '/categoria/retro' },
      { label: 'Seleções', href: '/categoria/retro' },
    ],
  },
  {
    label: 'Promoções',
    href: '/promocoes',
  },
  {
    label: 'Íntimas',
    href: '/categoria/cuecas-boxer',
    children: [
      { label: 'Cuecas & Boxer', href: '/categoria/cuecas-boxer' },
      { label: 'Linha Premium', href: '/categoria/intimas-masculinas' },
    ],
  },
];

export const FOOTER_POLICIES: NavLink[] = [
  { label: 'Política de privacidade', href: '/politica' },
  { label: 'Termos de uso', href: '/termos' },
  { label: 'Política de cookies', href: '/cookies' },
];

export const FOOTER_SUPPORT: NavLink[] = [
  { label: 'Trocas e devoluções', href: '/trocas' },
  { label: 'Entregas', href: '/trocas' },
  { label: 'Central de ajuda', href: '/contato' },
  { label: 'Fale conosco', href: '/contato' },
];

export const FOOTER_ACCOUNT: NavLink[] = [
  { label: 'Minha conta', href: '/minha-conta' },
  { label: 'Meus pedidos', href: '/pedidos' },
  { label: 'Favoritos', href: '/favoritos' },
];

export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/underselectoficial_?igsh=MXJtc3p2ZDByNWI4Zg%3D%3D',
  },
] as const;

export const HEADER_ACTIONS = {
  search: '/busca' as Route,
  account: '/minha-conta' as Route,
  favorites: '/favoritos' as Route,
  cart: '/carrinho' as Route,
  login: '/login' as Route,
};
