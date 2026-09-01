'use client';

import { Plus, Trash2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import {
  FormCurrencyInput,
  FormInput,
  FormSection,
} from '@presentation/components/forms';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { PRODUCT_CLOTHING_SIZES } from '@shared/constants/product-admin.constants';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';
import { generateSku } from '@presentation/stores/admin/product';

function buildVariationSku(baseSku: string, size: string) {
  const normalizedBase = baseSku.trim() || generateSku();
  const normalizedSize = size.trim().toUpperCase();
  return `${normalizedBase}-${normalizedSize}`;
}

export const AdminProductFormVariations = memo(
  function AdminProductFormVariations() {
    const { control, setValue } = useFormContext<AdminProductFormSchema>();
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'variations',
    });

    const [baseSku, basePrice] = useWatch({
      control,
      name: ['sku', 'price'],
    });

    const usedSizes = useWatch({
      control,
      name: 'variations',
    });

    const availableSizes = useMemo(() => {
      const taken = new Set(
        (usedSizes ?? [])
          .map((variation) => variation?.size?.trim().toUpperCase())
          .filter(Boolean),
      );

      return PRODUCT_CLOTHING_SIZES.filter((size) => !taken.has(size));
    }, [usedSizes]);

    const handleAddSize = () => {
      const nextSize = availableSizes[0];
      if (!nextSize) return;

      append({
        size: nextSize,
        color: 'Principal',
        model: 'Padrão',
        sku: buildVariationSku(String(baseSku ?? ''), nextSize),
        price: Number(basePrice) || 0,
        stock: 0,
      });
    };

    return (
      <FormSection
        title="Tamanhos disponíveis"
        description="Cadastre cada tamanho com preço e estoque. Na loja, o cliente verá o valor e a disponibilidade ao selecionar o tamanho."
      >
        {fields.length === 0 ? (
          <div className="border-border text-muted-foreground rounded-md border border-dashed p-6 text-sm">
            Nenhum tamanho cadastrado. Adicione os tamanhos que este produto
            oferece.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-muted-foreground hidden gap-3 px-1 text-xs tracking-wide uppercase md:grid md:grid-cols-[120px_1fr_1fr_1.4fr_88px]">
              <span>Tamanho</span>
              <span>Preço (R$)</span>
              <span>Estoque</span>
              <span>SKU</span>
              <span />
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border-border grid gap-3 rounded-md border p-4 md:grid-cols-[120px_1fr_1fr_1.4fr_88px] md:items-end"
              >
                <div className="space-y-2">
                  <Label className="md:sr-only">Tamanho</Label>
                  <Select
                    value={usedSizes?.[index]?.size ?? ''}
                    onValueChange={(size) => {
                      setValue(`variations.${index}.size`, size, {
                        shouldDirty: true,
                      });
                      setValue(
                        `variations.${index}.sku`,
                        buildVariationSku(String(baseSku ?? ''), size),
                        { shouldDirty: true },
                      );
                    }}
                  >
                    <SelectTrigger aria-label={`Tamanho ${index + 1}`}>
                      <SelectValue placeholder="Tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CLOTHING_SIZES.map((size) => {
                        const isTaken = (usedSizes ?? []).some(
                          (variation, variationIndex) =>
                            variationIndex !== index &&
                            variation?.size?.trim().toUpperCase() === size,
                        );

                        return (
                          <SelectItem
                            key={size}
                            value={size}
                            disabled={isTaken}
                          >
                            {size}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <FormCurrencyInput<AdminProductFormSchema>
                  name={`variations.${index}.price`}
                  label="Preço"
                />
                <FormInput<AdminProductFormSchema>
                  name={`variations.${index}.stock`}
                  label="Estoque"
                  type="number"
                  min={0}
                />
                <FormInput<AdminProductFormSchema>
                  name={`variations.${index}.sku`}
                  label="SKU"
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          disabled={availableSizes.length === 0}
          onClick={handleAddSize}
        >
          <Plus className="mr-2 size-4" />
          Adicionar tamanho
        </Button>
      </FormSection>
    );
  },
);
