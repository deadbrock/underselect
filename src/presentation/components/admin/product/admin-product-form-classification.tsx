'use client';

import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormInput, FormSection } from '@presentation/components/forms';
import { Spinner } from '@presentation/components/feedback';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { useClassificationOptions } from '@presentation/hooks/use-classification-options';
import {
  CATALOG_BRANDS,
  CATALOG_SEASONS,
  CATALOG_TYPES,
} from '@shared/constants/catalog.constants';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

import { ProductImageUploadField } from './product-image-upload-field';

export const AdminProductFormClassification = memo(
  function AdminProductFormClassification() {
    const { control } = useFormContext<AdminProductFormSchema>();
    const { categories, collections, teams, selections, isLoading } =
      useClassificationOptions();

    const emptyCategoryMessage =
      categories.length === 0
        ? 'Cadastre categorias em Admin → Categorias.'
        : 'Selecione uma categoria';
    const emptyCollectionMessage =
      collections.length === 0
        ? 'Cadastre coleções em Admin → Coleções.'
        : 'Selecione uma coleção';

    return (
      <FormSection title="Classificação">
        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Spinner className="size-3" />
            Atualizando opções do catálogo...
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={field.value || '__empty__'}
                  onValueChange={(value) =>
                    field.onChange(value === '__empty__' ? '' : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__" disabled>
                      {emptyCategoryMessage}
                    </SelectItem>
                    {categories.map((c) => (
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
          <FormInput<AdminProductFormSchema>
            name="model"
            label="Modelo"
            placeholder="Ex.: Torcedor, Jogador, Home 2024/25"
          />
          <Controller
            name="collection"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Coleção</Label>
                <Select
                  value={field.value || '__empty__'}
                  onValueChange={(value) =>
                    field.onChange(value === '__empty__' ? '' : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Coleção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__" disabled>
                      {emptyCollectionMessage}
                    </SelectItem>
                    {collections.map((c) => (
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
                    {teams.length === 0 && !isLoading ? (
                      <SelectItem value="__no-teams__" disabled>
                        Nenhum time cadastrado
                      </SelectItem>
                    ) : null}
                    {teams.map((t) => (
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
                    {selections.length === 0 && !isLoading ? (
                      <SelectItem value="__no-selections__" disabled>
                        Nenhuma seleção cadastrada
                      </SelectItem>
                    ) : null}
                    {selections.map((s) => (
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
        <ProductImageUploadField />
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
