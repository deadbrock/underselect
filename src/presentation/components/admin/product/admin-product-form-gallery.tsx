'use client';

import { Plus, Star, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormInput, FormSection } from '@presentation/components/forms';
import { Button } from '@presentation/components/ui';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormGallery = memo(function AdminProductFormGallery() {
  const { control, setValue, watch } = useFormContext<AdminProductFormSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallery',
  });
  const gallery = watch('gallery');

  const setCover = (index: number) => {
    gallery.forEach((_, i) => {
      setValue(`gallery.${i}.isCover`, i === index);
    });
  };

  return (
    <FormSection
      title="Galeria"
      description="Imagem principal e galeria ordenada. Upload preparado para próxima fase."
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-border flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-end"
          >
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <FormInput<AdminProductFormSchema>
                name={`gallery.${index}.url`}
                label="URL da imagem"
              />
              <FormInput<AdminProductFormSchema>
                name={`gallery.${index}.alt`}
                label="Texto alternativo"
              />
              <FormInput<AdminProductFormSchema>
                name={`gallery.${index}.order`}
                label="Ordem"
                type="number"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={gallery[index]?.isCover ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCover(index)}
              >
                <Star className="mr-1 size-4" />
                Capa
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
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
            url: '/images/catalog/product-1.svg',
            alt: '',
            isCover: fields.length === 0,
            order: fields.length,
          })
        }
      >
        <Plus className="mr-2 size-4" />
        Adicionar imagem
      </Button>
    </FormSection>
  );
});
