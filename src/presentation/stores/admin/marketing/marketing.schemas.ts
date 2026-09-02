import { z } from 'zod';

export function normalizeAlphanumericCode(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

function alphanumericCodeSchema(emptyMessage: string) {
  return z
    .string()
    .transform(normalizeAlphanumericCode)
    .pipe(
      z
        .string()
        .min(2, emptyMessage)
        .regex(/^[A-Z0-9]+$/, 'Use apenas letras maiúsculas e números'),
    );
}

export const influencerFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  username: z.string().min(2, 'Informe o usuário'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  identifierCode: alphanumericCodeSchema('Código identificador obrigatório'),
  status: z.enum(['active', 'inactive']),
  notes: z.string(),
});

export const campaignFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome da campanha'),
  description: z.string(),
  influencerId: z.string().min(1, 'Selecione um influenciador'),
  couponIds: z.array(z.string()),
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
  status: z.enum(['planned', 'active', 'finished', 'paused']),
  objective: z.string(),
  notes: z.string(),
  categorySlug: z.string().optional(),
  productIds: z.array(z.string()),
  salesGoal: z.coerce.number().optional(),
  ordersGoal: z.coerce.number().optional(),
});

export const couponRulesSchema = z.object({
  minOrderValue: z.coerce.number().optional(),
  categorySlug: z.string().optional(),
  productId: z.string().optional(),
  firstPurchaseOnly: z.boolean().optional(),
  minQuantity: z.coerce.number().optional(),
  freeShipping: z.boolean().optional(),
});

export const couponFormSchema = z.object({
  code: alphanumericCodeSchema('Código obrigatório'),
  name: z.string().min(2, 'Informe o nome'),
  description: z.string(),
  discountType: z.enum([
    'percent',
    'fixed',
    'free-shipping',
    'first-purchase',
    'category',
    'product',
    'min-order',
  ]),
  value: z.coerce.number().min(0),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  usageLimit: z.coerce.number().optional(),
  usageLimitPerCustomer: z.coerce.number().optional(),
  status: z.enum(['active', 'scheduled', 'expired', 'paused', 'depleted']),
  influencerId: z.string().optional(),
  campaignId: z.string().optional(),
  rules: couponRulesSchema,
});

export type InfluencerFormValues = z.infer<typeof influencerFormSchema>;
export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
export type CouponFormValues = z.infer<typeof couponFormSchema>;
