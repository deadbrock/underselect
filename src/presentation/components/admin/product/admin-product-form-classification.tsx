'use client';

import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormInput, FormSection } from '@presentation/components/forms';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import {
  CATALOG_BRANDS,
  CATALOG_CATEGORIES,
  CATALOG_SEASONS,
  CATALOG_SELECTIONS,
  CATALOG_TEAMS,
  CATALOG_TYPES,
} from '@shared/mocks/catalog.constants';
import { ADMIN_PRODUCT_COLLECTIONS } from '@shared/constants/product-admin.constants';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormClassification = memo(
  function AdminProductFormClassification() {
    const { control } = useFormContext<AdminProductFormSchema>();

    return (
      <FormSection title="Classificação">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-destructive text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-destructive text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="collection"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Coleção</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Coleção" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_PRODUCT_COLLECTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Marca</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG_BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="team"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Time</Label>
                <Select
                  value={field.value ?? '__none__'}
                  onValueChange={(v) =>
                    field.onChange(v === '__none__' ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhum</SelectItem>
                    {CATALOG_TEAMS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="selection"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Seleção</Label>
                <Select
                  value={field.value ?? '__none__'}
                  onValueChange={(v) =>
                    field.onChange(v === '__none__' ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhuma</SelectItem>
                    {CATALOG_SELECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Temporada</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Temporada" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG_SEASONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
        <FormInput<AdminProductFormSchema>
          name="imageUrl"
          label="Imagem principal (URL)"
        />
        <FormInput<AdminProductFormSchema>
          name="imageAlt"
          label="Alt da imagem"
        />
        <FormInput<AdminProductFormSchema>
          name="badge"
          label="Badge"
          placeholder="Opcional"
        />
      </FormSection>
    );
  },
);
