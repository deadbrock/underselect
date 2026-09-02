'use client';

import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormInput, FormSection } from '@presentation/components/forms';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';
import { slugify } from '@presentation/stores/admin/product';

export const AdminProductFormBasic = memo(function AdminProductFormBasic() {
  const { setValue, watch } = useFormContext<AdminProductFormSchema>();
  const name = watch('name');

  const handleNameBlur = () => {
    const currentSlug = watch('slug');
    if (!currentSlug && name) {
      const slug = slugify(name);
      setValue('slug', slug, { shouldValidate: true });
      setValue('seo.slug', slug, { shouldValidate: true });
      setValue('seo.metaTitle', `${name} | UNDER SELECT`, {
        shouldValidate: true,
      });
    }
  };

  return (
    <FormSection
      title="Informações básicas"
      description="Nome, identificação e descrições."
    >
      <FormInput<AdminProductFormSchema>
        name="name"
        label="Nome"
        onBlur={handleNameBlur}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<AdminProductFormSchema>
          name="slug"
          label="Slug"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          valueTransform={(value) => value.toLowerCase()}
        />
        <FormInput<AdminProductFormSchema> name="sku" label="SKU" />
      </div>
      <FormInput<AdminProductFormSchema>
        name="shortDescription"
        label="Descrição curta"
      />
      <FormInput<AdminProductFormSchema>
        name="fullDescription"
        label="Descrição completa"
      />
    </FormSection>
  );
});
