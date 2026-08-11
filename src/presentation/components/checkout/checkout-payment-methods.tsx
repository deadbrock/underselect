'use client';

import { Banknote, CreditCard, QrCode } from 'lucide-react';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Label } from '@presentation/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { FormSection } from '@presentation/components/forms';
import type { CheckoutFormSchema } from '@presentation/stores/checkout';
import type { PaymentMethod } from '@shared/types/checkout.types';
import { cn } from '@shared/utils/cn';

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof QrCode;
}[] = [
  {
    id: 'pix',
    label: 'PIX',
    description: 'Aprovação imediata — InfinitePay',
    icon: QrCode,
  },
  {
    id: 'card',
    label: 'Cartão de crédito',
    description: 'Parcelamento disponível — InfinitePay',
    icon: CreditCard,
  },
  {
    id: 'boleto',
    label: 'Boleto bancário',
    description: 'Vencimento em 3 dias úteis — InfinitePay',
    icon: Banknote,
  },
];

export interface CheckoutPaymentMethodsProps {
  maxInstallments: number;
}

export const CheckoutPaymentMethods = memo(function CheckoutPaymentMethods({
  maxInstallments,
}: CheckoutPaymentMethodsProps) {
  const { watch, setValue } = useFormContext<CheckoutFormSchema>();
  const paymentMethod = watch('paymentMethod');
  const cardInstallments = watch('cardInstallments');

  return (
    <FormSection
      title="Pagamento"
      description="Arquitetura preparada para integração com InfinitePay."
    >
      <div className="grid gap-3">
        {PAYMENT_OPTIONS.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() =>
              setValue('paymentMethod', id, { shouldValidate: true })
            }
            aria-pressed={paymentMethod === id}
            className={cn(
              'border-border flex items-start gap-4 border p-4 text-left transition-all',
              paymentMethod === id &&
                'border-foreground bg-muted/30 ring-foreground/10 ring-1',
            )}
          >
            <Icon className="text-muted-foreground mt-0.5 size-5 shrink-0" />
            <span>
              <span className="block text-sm font-medium">{label}</span>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-2 pt-2">
          <Label htmlFor="card-installments">Parcelamento</Label>
          <Select
            value={String(cardInstallments)}
            onValueChange={(value) =>
              setValue('cardInstallments', Number(value), {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="card-installments" aria-label="Parcelamento">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
                (count) => (
                  <SelectItem key={count} value={String(count)}>
                    {count}x sem juros
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </FormSection>
  );
});
