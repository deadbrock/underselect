'use client';

import { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormSection } from '@presentation/components/forms';
import type { CheckoutFormSchema } from '@presentation/stores/checkout';

export const CheckoutPaymentMethods = memo(function CheckoutPaymentMethods() {
  const { setValue } = useFormContext<CheckoutFormSchema>();

  useEffect(() => {
    setValue('paymentMethod', 'pix', { shouldValidate: true });
    setValue('cardInstallments', 1, { shouldValidate: true });
  }, [setValue]);

  return (
    <FormSection
      title="Pagamento"
      description="Após confirmar o pedido, você será redirecionado com segurança para a InfinitePay para pagar com PIX ou cartão de crédito."
    >
      <div className="border-border bg-muted/20 space-y-2 border p-4 text-sm">
        <p>PIX — confirmação rápida</p>
        <p>
          Cartão de crédito — parcelamento conforme disponibilidade na
          InfinitePay
        </p>
        <p className="text-muted-foreground text-xs">
          O método final é escolhido na página segura da InfinitePay. A
          confirmação do pagamento ocorre somente após validação server-side.
        </p>
      </div>
    </FormSection>
  );
});
