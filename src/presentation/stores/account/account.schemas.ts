import { z } from 'zod';

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  const calcDigit = (slice: number) => {
    const sum = digits
      .slice(0, slice)
      .split('')
      .reduce(
        (acc, digit, index) => acc + Number(digit) * (slice + 1 - index),
        0,
      );
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return (
    calcDigit(9) === Number(digits[9]) && calcDigit(10) === Number(digits[10])
  );
}

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(2, 'Informe seu nome'),
  lastName: z.string().trim().min(2, 'Informe seu sobrenome'),
  cpf: z.string().trim().refine(isValidCpf, 'CPF inválido'),
  phone: z
    .string()
    .trim()
    .refine((v) => onlyDigits(v).length >= 10, 'Telefone inválido'),
  birthDate: z.string().trim().min(1, 'Informe a data de nascimento'),
  email: z.string().trim().email('E-mail inválido'),
  marketingEmail: z.boolean(),
  marketingSms: z.boolean(),
  newsletter: z.boolean(),
});

export const addressFormSchema = z.object({
  label: z.string().trim().min(2, 'Informe um nome para o endereço'),
  cep: z
    .string()
    .trim()
    .refine((v) => onlyDigits(v).length === 8, 'CEP inválido'),
  street: z.string().trim().min(3, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, 'Informe o bairro'),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z.string().trim().length(2, 'Use a sigla do estado'),
  reference: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
});

export const changePasswordSchema = z
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

export const loginFormSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'Informe a senha'),
});

export const settingsFormSchema = z.object({
  themePreference: z.enum(['system', 'light', 'dark']),
  orderNotifications: z.boolean(),
  promoNotifications: z.boolean(),
  newsletter: z.boolean(),
  promotionalCommunication: z.boolean(),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
export type AddressFormSchema = z.infer<typeof addressFormSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;
