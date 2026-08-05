import { z } from 'zod';

const categorySlugs = [
  'clubes-brasileiros',
  'selecoes',
  'retro',
  'casual-esportiva',
  'cuecas-boxer',
  'intimas-masculinas',
] as const;

const productTypes = [
  'camisa-clube',
  'camisa-selecao',
  'camisa-retro',
  'casual-esportiva',
  'cueca',
  'boxer',
  'intima-masculina',
] as const;

export const productVariationSchema = z.object({
  id: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  model: z.string().optional(),
  sku: z.string().trim().min(1, 'Informe o SKU da variação'),
  price: z.coerce.number().positive('Preço inválido'),
  stock: z.coerce.number().int().min(0, 'Estoque inválido'),
  imageUrl: z.string().optional(),
});

export const productGallerySchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, 'Informe a URL da imagem'),
  alt: z.string().optional(),
  isCover: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const productSeoSchema = z.object({
  metaTitle: z.string().trim().min(1, 'Informe o meta title'),
  metaDescription: z.string().trim().min(1, 'Informe a meta description'),
  keywords: z.string().trim(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

export const adminProductFormSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  sku: z.string().trim().min(1, 'Informe o SKU'),
  shortDescription: z.string().trim().min(10, 'Descrição curta muito curta'),
  fullDescription: z.string().trim().min(20, 'Descrição completa muito curta'),
  category: z.enum(categorySlugs),
  type: z.enum(productTypes),
  collection: z.string().trim().min(1, 'Informe a coleção'),
  team: z.string().optional(),
  selection: z.string().optional(),
  brand: z.string().trim().min(1, 'Informe a marca'),
  season: z.string().trim().min(1, 'Informe a temporada'),
  tags: z.array(z.string()),
  price: z.coerce.number().min(0, 'Preço inválido'),
  compareAtPrice: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  onSale: z.boolean(),
  isBestSeller: z.boolean(),
  status: z.enum(['active', 'inactive', 'draft', 'archived']),
  inStock: z.boolean(),
  stockQuantity: z.coerce.number().int().min(0),
  sizes: z.array(z.string()).min(1, 'Selecione ao menos um tamanho'),
  installmentCount: z.coerce.number().int().min(1).max(12),
  imageUrl: z.string().trim().min(1, 'Informe a imagem principal'),
  imageAlt: z.string().optional(),
  badge: z.string().optional(),
  variations: z.array(productVariationSchema),
  gallery: z.array(productGallerySchema),
  seo: productSeoSchema,
});

export type AdminProductFormSchema = z.infer<typeof adminProductFormSchema>;
export type ProductVariationSchema = z.infer<typeof productVariationSchema>;
export type ProductGallerySchema = z.infer<typeof productGallerySchema>;
export type ProductSeoSchema = z.infer<typeof productSeoSchema>;
