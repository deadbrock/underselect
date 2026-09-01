'use client';

import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  FormCurrencyInput,
  FormInput,
  FormIntegerInput,
  FormSection,
} from '@presentation/components/forms';
import { Checkbox, Label } from '@presentation/components/ui';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormPricing = memo(function AdminProductFormPricing() {
  const { control, watch } = useFormContext<AdminProductFormSchema>();
  const noPromotionalPrice = watch('noPromotionalPrice');
  const listPrice = watch('listPrice');
  const promoPrice = watch('promoPrice');

  return (
    <>
      <FormSection
        title="Preço e estoque"
        description="O preço promocional é o valor exibido na loja. O preço de tabela aparece riscado quando houver promoção."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormCurrencyInput<AdminProductFormSchema>
            name="listPrice"
            label="Preço de tabela"
          />

          <Controller
            name="noPromotionalPrice"
            control={control}
            render={({ field }) => (
              <div className="flex items-end pb-2 sm:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="noPromotionalPrice"
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                  <Label htmlFor="noPromotionalPrice" className="font-normal">
                    Sem preço promocional
                  </Label>
                </div>
              </div>
            )}
          />

          {!noPromotionalPrice && (
            <FormCurrencyInput<AdminProductFormSchema>
              name="promoPrice"
              label="Preço promocional (valor exibido na loja)"
            />
          )}

          <FormCurrencyInput<AdminProductFormSchema>
            name="cost"
            label="Custo"
          />
          <FormIntegerInput<AdminProductFormSchema>
            name="stockQuantity"
            label="Estoque"
          />
          <FormInput<AdminProductFormSchema>
            name="installmentCount"
            label="Parcelas"
            type="number"
            inputMode="numeric"
          />
        </div>

        <div className="bg-muted/40 rounded-lg border p-4 text-sm">
          <p className="text-muted-foreground mb-1 font-medium">
            Prévia na loja
          </p>
          {noPromotionalPrice ? (
            <p>
              Valor exibido:{' '}
              <span className="font-medium tabular-nums">
                {formatCurrency(listPrice)}
              </span>
            </p>
          ) : (
            <p>
              Valor exibido:{' '}
              <span className="font-medium tabular-nums">
                {formatCurrency(promoPrice ?? 0)}
              </span>
              {listPrice > 0 &&
                promoPrice != null &&
                promoPrice < listPrice && (
                  <>
                    {' '}
                    <span className="text-muted-foreground tabular-nums line-through">
                      {formatCurrency(listPrice)}
                    </span>
                  </>
                )}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Dimensões e peso"
        description="Para cálculo de frete futuro."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput<AdminProductFormSchema>
            name="weight"
            label="Peso (kg)"
            type="number"
          />
          <FormInput<AdminProductFormSchema>
            name="height"
            label="Altura (cm)"
            type="number"
          />
          <FormInput<AdminProductFormSchema>
            name="width"
            label="Largura (cm)"
            type="number"
          />
          <FormInput<AdminProductFormSchema>
            name="length"
            label="Comprimento (cm)"
            type="number"
          />
        </div>
      </FormSection>
    </>
  );
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(value) ? value : 0);
}
