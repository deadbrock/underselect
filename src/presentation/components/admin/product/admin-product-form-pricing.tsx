'use client';

import { memo } from 'react';

import { FormInput, FormSection } from '@presentation/components/forms';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormPricing = memo(function AdminProductFormPricing() {
  return (
    <>
      <FormSection title="Preço e estoque">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput<AdminProductFormSchema>
            name="price"
            label="Preço"
            type="number"
            inputMode="decimal"
          />
          <FormInput<AdminProductFormSchema>
            name="compareAtPrice"
            label="Preço promocional"
            type="number"
            inputMode="decimal"
          />
          <FormInput<AdminProductFormSchema>
            name="cost"
            label="Custo"
            type="number"
            inputMode="decimal"
          />
          <FormInput<AdminProductFormSchema>
            name="stockQuantity"
            label="Estoque"
            type="number"
            inputMode="numeric"
          />
          <FormInput<AdminProductFormSchema>
            name="installmentCount"
            label="Parcelas"
            type="number"
            inputMode="numeric"
          />
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
