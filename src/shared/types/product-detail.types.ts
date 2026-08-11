import type { CatalogProduct } from '@shared/types/catalog.types';
import type { ProductVariationOption } from '@shared/utils/product-variation.utils';

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductColorOption {
  id: string;
  label: string;
  hex: string;
  disabled?: boolean;
}

export interface ProductModelOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductSizeChartRow {
  size: string;
  chest: string;
  length: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductReviewComment {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified?: boolean;
}

export interface ProductReviews {
  averageRating: number;
  totalCount: number;
  distribution: { stars: number; count: number }[];
  comments: ProductReviewComment[];
  customerPhotosReady: boolean;
}

export interface ProductDetail extends CatalogProduct {
  sku: string;
  collection: string;
  images: ProductImage[];
  colors: ProductColorOption[];
  models: ProductModelOption[];
  variations: ProductVariationOption[];
  unavailableSizes: string[];
  description: string;
  specifications: ProductSpecification[];
  sizeChart: ProductSizeChartRow[];
  returnsPolicy: string;
  faq: ProductFaqItem[];
  reviews: ProductReviews;
  estimatedDelivery: string;
  customizationAvailable: boolean;
}

export interface ProductRelatedGroups {
  similar: CatalogProduct[];
  alsoBought: CatalogProduct[];
  sameCollection: CatalogProduct[];
}
