import { z } from 'zod';

import { normalizeCep } from '@presentation/stores/cart/cart.helpers';

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

function isValidPhone(phone: string): boolean {
  const digits = onlyDigits(phone);
  return digits.length >= 10 && digits.length <= 11;
}

export const checkoutCustomerSchema = z.object({
  firstName: z.string().trim().min(2, 'Informe seu nome'),
  lastName: z.string().trim().min(2, 'Informe seu sobrenome'),
  cpf: z
    .string()
    .trim()
    .min(11, 'Informe um CPF válido')
    .refine(isValidCpf, 'CPF inválido'),
  email: z.string().trim().email('Informe um e-mail válido'),
  phone: z
    .string()
    .trim()
    .min(10, 'Informe um telefone válido')
    .refine(isValidPhone, 'Telefone inválido'),
  createAccount: z.boolean(),
});

export const checkoutAddressSchema = z.object({
  cep: z
    .string()
    .trim()
    .refine((value) => normalizeCep(value).length === 8, 'CEP inválido'),
  street: z.string().trim().min(3, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, 'Informe o bairro'),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z
    .string()
    .trim()
    .length(2, 'Use a sigla do estado (ex: SP)')
    .transform((value) => value.toUpperCase()),
  reference: z.string().trim().optional(),
});

export const checkoutPaymentSchema = z.object({
  paymentMethod: z.enum(['pix', 'card']),
  cardInstallments: z.number().int().min(1).max(12),
});

export const checkoutFormSchema = checkoutCustomerSchema
  .merge(checkoutAddressSchema)
  .merge(checkoutPaymentSchema);

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;

export const checkoutDefaultValues: CheckoutFormSchema = {
  firstName: '',
  lastName: '',
  cpf: '',
  email: '',
  phone: '',
  createAccount: false,
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  reference: '',
  paymentMethod: 'pix',
  cardInstallments: 1,
};
