import { z } from 'zod';

export const shippingConfigSchema = z
  .object({
    shippingBaseFee: z.coerce.number().min(0, 'Valor não pode ser negativo'),
    shippingPerKm: z.coerce.number().min(0, 'Valor não pode ser negativo'),
    shippingMinFee: z.coerce.number().min(0, 'Valor não pode ser negativo'),
    shippingMaxFee: z.coerce.number().min(0, 'Valor não pode ser negativo'),
    freeShippingEnabled: z.boolean(),
    freeShippingMinValue: z.coerce
      .number()
      .min(0, 'Valor não pode ser negativo'),
    distanceCalculationEnabled: z.boolean(),
    distanceRangesEnabled: z.boolean(),
  })
  .refine(
    (values) =>
      values.shippingMaxFee === 0 ||
      values.shippingMinFee <= values.shippingMaxFee,
    {
      message: 'O frete mínimo não pode ser maior que o frete máximo.',
      path: ['shippingMinFee'],
    },
  );

export type ShippingConfigSchema = z.infer<typeof shippingConfigSchema>;

export const shippingRangeSchema = z
  .object({
    startKm: z.coerce.number().min(0, 'Distância inicial inválida'),
    endKm: z.coerce.number().min(0, 'Distância final inválida'),
    pricePerKm: z.coerce.number().min(0, 'Valor por KM inválido'),
    additionalFee: z.coerce.number().min(0, 'Taxa adicional inválida'),
    enabled: z.boolean(),
  })
  .refine((values) => values.endKm > values.startKm, {
    message: 'A distância final deve ser maior que a inicial.',
    path: ['endKm'],
  });

export type ShippingRangeSchema = z.infer<typeof shippingRangeSchema>;

export const shippingPreviewSchema = z.object({
  destinationCep: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8}$/, 'Informe um CEP válido')),
  subtotal: z.coerce.number().min(0, 'Valor da compra inválido'),
  couponCode: z.string().trim().optional(),
});

export type ShippingPreviewSchema = z.infer<typeof shippingPreviewSchema>;
