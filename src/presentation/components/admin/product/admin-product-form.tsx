'use client';

import { memo, useCallback } from 'react';
import type { FieldErrors } from 'react-hook-form';

import { Form, useAppForm } from '@presentation/components/forms';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import {
  adminProductFormSchema,
  createEmptyProductFormDefaults,
  prepareProductFormValues,
  productToFormValues,
  type AdminProductFormSchema,
} from '@presentation/stores/admin/product';
import type { AdminProduct } from '@shared/types/product-admin.types';

import { AdminProductFormBasic } from './admin-product-form-basic';
import { AdminProductFormClassification } from './admin-product-form-classification';
import { AdminProductFormFlags } from './admin-product-form-flags';
import { AdminProductFormGallery } from './admin-product-form-gallery';
import { AdminProductFormPricing } from './admin-product-form-pricing';
import { AdminProductFormSeo } from './admin-product-form-seo';
import { AdminProductFormVariations } from './admin-product-form-variations';

export interface AdminProductFormProps {
  product?: AdminProduct;
  onSubmit: (values: AdminProductFormSchema) => void | Promise<void>;
  formId?: string;
}

function getFirstFormError(errors: FieldErrors): string | undefined {
  for (const value of Object.values(errors)) {
    if (!value) continue;
    if (typeof value === 'object' && 'message' in value && value.message) {
      return String(value.message);
    }
    if (typeof value === 'object') {
      const nested = getFirstFormError(value as FieldErrors);
      if (nested) return nested;
    }
  }
  return undefined;
}

export const AdminProductForm = memo(function AdminProductForm({
  product,
  onSubmit,
  formId = 'admin-product-form',
}: AdminProductFormProps) {
  const form = useAppForm(adminProductFormSchema, {
    defaultValues: product
      ? productToFormValues(product)
      : createEmptyProductFormDefaults(),
  });

  const handleInvalid = useCallback(
    (errors: FieldErrors<AdminProductFormSchema>) => {
      const message =
        getFirstFormError(errors) ??
        'Revise os campos obrigatórios nas abas Básico, Preço e SEO.';
      toast.error(message);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (values: AdminProductFormSchema) => {
      await onSubmit(values);
    },
    [onSubmit],
  );

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prepared = prepareProductFormValues(form.getValues());
    form.reset(prepared, { keepDirtyValues: false });
    void form.handleSubmit(handleSubmit, handleInvalid)();
  };

  return (
    <Form form={form} id={formId} onSubmit={onFormSubmit}>
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="classification">Classificação</TabsTrigger>
          <TabsTrigger value="pricing">Preço</TabsTrigger>
          <TabsTrigger value="variations">Variações</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="flags">Status</TabsTrigger>
        </TabsList>
        <TabsContent
          value="basic"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormBasic />
        </TabsContent>
        <TabsContent
          value="classification"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormClassification />
        </TabsContent>
        <TabsContent
          value="pricing"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormPricing />
        </TabsContent>
        <TabsContent
          value="variations"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormVariations />
        </TabsContent>
        <TabsContent
          value="gallery"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormGallery />
        </TabsContent>
        <TabsContent
          value="seo"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormSeo />
        </TabsContent>
        <TabsContent
          value="flags"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AdminProductFormFlags />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" className="min-h-11 min-w-[160px]">
          Salvar produto
        </Button>
      </div>
    </Form>
  );
});
