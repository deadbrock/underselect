import type { Metadata } from 'next';

import { env } from '@infrastructure/config';

import { STORE_NAME } from '../constants/store-navigation';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: `/${string}` | '/';
  noIndex?: boolean;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = '/og-default.svg';

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path, noIndex = false, ogImage } = options;
  const canonicalUrl = new URL(path, env.NEXT_PUBLIC_APP_URL).toString();
  const imageUrl = new URL(
    ogImage ?? DEFAULT_OG_IMAGE,
    env.NEXT_PUBLIC_APP_URL,
  ).toString();
  const fullTitle =
    title === 'Início' ? STORE_NAME : `${title} | ${STORE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: STORE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: STORE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function createPrivatePageMetadata(
  options: PageMetadataOptions,
): Metadata {
  return createPageMetadata({ ...options, noIndex: true });
}
