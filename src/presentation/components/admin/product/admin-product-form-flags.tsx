'use client';

import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormSection } from '@presentation/components/forms';
import {
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormFlags = memo(function AdminProductFormFlags() {
  const { control } = useFormContext<AdminProductFormSchema>();

  return (
    <FormSection title="Status e destaques">
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <FlagCheckbox name="isFeatured" label="Produto destaque" />
        <FlagCheckbox name="isNew" label="Produto novo" />
        <FlagCheckbox name="onSale" label="Promoção" />
        <FlagCheckbox name="isBestSeller" label="Mais vendido" />
        <FlagCheckbox name="inStock" label="Disponível" />
      </div>
    </FormSection>
  );
});

function FlagCheckbox({
  name,
  label,
}: {
  name: keyof Pick<
    AdminProductFormSchema,
    'isFeatured' | 'isNew' | 'onSale' | 'isBestSeller' | 'inStock'
  >;
  label: string;
}) {
  const { control } = useFormContext<AdminProductFormSchema>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={(v) => field.onChange(v === true)}
          />
          <Label htmlFor={name} className="font-normal">
            {label}
          </Label>
        </div>
      )}
    />
  );
}
