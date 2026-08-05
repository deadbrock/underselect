'use client';

import { Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormInput, FormSection } from '@presentation/components/forms';
import { Button } from '@presentation/components/ui';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';
import { generateSku } from '@presentation/stores/admin/product';

export const AdminProductFormVariations = memo(
  function AdminProductFormVariations() {
    const { control } = useFormContext<AdminProductFormSchema>();
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'variations',
    });

    return (
      <FormSection
        title="Variações"
        description="Tamanho, cor ou modelo com SKU, preço e estoque próprios."
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border-border grid gap-3 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.size`}
                label="Tamanho"
                placeholder="M"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.color`}
                label="Cor"
                placeholder="Principal"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.model`}
                label="Modelo"
                placeholder="Opcional"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.sku`}
                label="SKU"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.price`}
                label="Preço"
                type="number"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.stock`}
                label="Estoque"
                type="number"
              />
              <FormInput<AdminProductFormSchema>
                name={`variations.${index}.imageUrl`}
                label="Imagem (URL)"
                placeholder="Integração futura"
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              size: 'M',
              color: 'Principal',
              sku: generateSku('VAR'),
              price: 0,
              stock: 0,
            })
          }
        >
          <Plus className="mr-2 size-4" />
          Adicionar variação
        </Button>
      </FormSection>
    );
  },
);
