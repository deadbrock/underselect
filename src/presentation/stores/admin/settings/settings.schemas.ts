import { z } from 'zod';

export const adminAccessProfileSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  email: z.string().trim().email('Informe um e-mail válido'),
  phone: z.string().trim().optional().or(z.literal('')),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'Informe a senha'),
});

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Informe a senha atual'),
    newPassword: z
      .string()
      .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Za-z]/, 'A nova senha deve conter letras')
      .regex(/\d/, 'A nova senha deve conter números'),
    confirmPassword: z.string().min(8, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type AdminAccessProfileSchema = z.infer<typeof adminAccessProfileSchema>;
export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
export type AdminChangePasswordSchema = z.infer<
  typeof adminChangePasswordSchema
>;

export const adminStoreSettingsSchema = z.object({
  storeName: z.string().trim().min(2, 'Informe o nome da loja'),
  contactEmail: z.string().trim().email('Informe um e-mail de contato válido'),
  contactPhone: z.string().trim().optional().or(z.literal('')),
  storeLocation: z.string().trim().min(2, 'Informe a localização'),
  instagramUrl: z
    .string()
    .trim()
    .url('Informe uma URL válida do Instagram')
    .or(z.literal('')),
  maxInstallments: z.coerce
    .number()
    .int()
    .min(1, 'Mínimo 1 parcela')
    .max(12, 'Máximo 12 parcelas'),
  estimatedDelivery: z
    .string()
    .trim()
    .min(3, 'Informe o prazo estimado de entrega'),
  promoBarEnabled: z.boolean(),
  promoBarMessage: z
    .string()
    .trim()
    .min(3, 'Informe a mensagem da barra promocional'),
  ordersAlertEmail: z
    .string()
    .trim()
    .email('Informe um e-mail válido para alertas'),
  maintenanceMode: z.boolean(),
  shippingOriginCep: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8}$/, 'Informe um CEP válido com 8 dígitos')),
  shippingOriginStreet: z.string().trim().min(2, 'Informe a rua'),
  shippingOriginNumber: z.string().trim().min(1, 'Informe o número'),
  shippingOriginComplement: z.string().trim().optional().or(z.literal('')),
  shippingOriginNeighborhood: z.string().trim().min(2, 'Informe o bairro'),
  shippingOriginCity: z.string().trim().min(2, 'Informe a cidade'),
  shippingOriginState: z
    .string()
    .trim()
    .length(2, 'Informe a UF com 2 letras')
    .transform((value) => value.toUpperCase()),
});

export type AdminStoreSettingsSchema = z.infer<typeof adminStoreSettingsSchema>;
