import type { Route } from 'next';

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

export interface HomePromotionFlag {
  id: string;
  label: string;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
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

export interface HomeBenefitData {
  id: string;
  title: string;
  description: string;
}
