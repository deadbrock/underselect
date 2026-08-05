'use client';

import { memo } from 'react';

import { FormInput, FormSection } from '@presentation/components/forms';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';

export const AdminProductFormSeo = memo(function AdminProductFormSeo() {
  return (
    <FormSection
      title="SEO"
      description="Otimização para buscadores e redes sociais."
    >
      <FormInput<AdminProductFormSchema>
        name="seo.metaTitle"
        label="Meta Title"
      />
      <FormInput<AdminProductFormSchema>
        name="seo.metaDescription"
        label="Meta Description"
      />
      <FormInput<AdminProductFormSchema>
        name="seo.keywords"
        label="Palavras-chave"
      />
      <FormInput<AdminProductFormSchema> name="seo.slug" label="Slug SEO" />
      <FormInput<AdminProductFormSchema>
        name="seo.ogTitle"
        label="Open Graph — Título"
      />
      <FormInput<AdminProductFormSchema>
        name="seo.ogDescription"
        label="Open Graph — Descrição"
      />
      <FormInput<AdminProductFormSchema>
        name="seo.ogImage"
        label="Open Graph — Imagem (URL)"
      />
    </FormSection>
  );
});
