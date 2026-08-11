import { z } from 'zod';

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
  size: z.string().trim().min(1, 'Informe o tamanho'),
  color: z.string().optional(),
  model: z.string().optional(),
  sku: z.string().trim().min(1, 'Informe o SKU da variação'),
  price: z.coerce.number().positive('Preço inválido'),
  stock: z.coerce.number().int().min(0, 'Estoque inválido'),
  minStock: z.coerce.number().int().min(0, 'Mínimo inválido').optional(),
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

const adminProductFormFields = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  sku: z.string().trim().min(1, 'Informe o SKU'),
  shortDescription: z.string().trim().min(10, 'Descrição curta muito curta'),
  fullDescription: z.string().trim().min(20, 'Descrição completa muito curta'),
  category: z
    .string()
    .trim()
    .min(1, 'Selecione uma categoria')
    .regex(/^[a-z0-9-]+$/, 'Selecione uma categoria válida'),
  type: z.enum(productTypes),
  collection: z.string().trim().min(1, 'Informe a coleção'),
  team: z.string().optional(),
  selection: z.string().optional(),
  model: z.string().trim().min(1, 'Informe o modelo'),
  brand: z.string().trim().min(1, 'Informe a marca'),
  season: z.string().trim().min(1, 'Informe a temporada'),
  tags: z.array(z.string()),
  listPrice: z.coerce.number().min(0, 'Informe o preço de tabela'),
  promoPrice: z.coerce.number().min(0).optional(),
  noPromotionalPrice: z.boolean(),
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

export const adminProductFormSchema = adminProductFormFields
  .superRefine((data, ctx) => {
    if (data.noPromotionalPrice) return;

    const promo = data.promoPrice;
    if (promo == null || promo <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['promoPrice'],
        message: 'Informe o preço promocional',
      });
      return;
    }

    if (promo >= data.listPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['promoPrice'],
        message: 'O preço promocional deve ser menor que o preço de tabela',
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.variations.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['variations'],
        message: 'Adicione ao menos um tamanho na aba Variações',
      });
      return;
    }

    const seenSizes = new Set<string>();

    data.variations.forEach((variation, index) => {
      const size = variation.size.trim().toUpperCase();

      if (seenSizes.has(size)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['variations', index, 'size'],
          message: 'Tamanho duplicado',
        });
        return;
      }

      seenSizes.add(size);
    });
  });

export function enrichProductFormPricing(input: unknown): unknown {
  if (!input || typeof input !== 'object') return input;
  const data = input as Record<string, unknown>;
  if ('listPrice' in data) return input;

  const price = Number(data.price ?? 0);
  const compareAt =
    data.compareAtPrice != null ? Number(data.compareAtPrice) : undefined;
  const hasPromo = compareAt != null && compareAt > price;

  return {
    ...data,
    listPrice: hasPromo ? compareAt : price,
    promoPrice: hasPromo ? price : undefined,
    noPromotionalPrice: !hasPromo,
  };
}

export function parseAdminProductForm(body: unknown) {
  return adminProductFormSchema.parse(enrichProductFormPricing(body));
}

export type AdminProductFormSchema = z.infer<typeof adminProductFormSchema>;
export type ProductVariationSchema = z.infer<typeof productVariationSchema>;
export type ProductGallerySchema = z.infer<typeof productGallerySchema>;
export type ProductSeoSchema = z.infer<typeof productSeoSchema>;
