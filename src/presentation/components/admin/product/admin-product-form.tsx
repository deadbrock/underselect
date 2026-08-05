'use client';

import { memo } from 'react';

import { Form, useAppForm } from '@presentation/components/forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@presentation/components/ui';
import {
  adminProductFormSchema,
  createEmptyProductDefaults,
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
  onSubmit: (values: AdminProductFormSchema) => void;
  formId?: string;
}

export const AdminProductForm = memo(function AdminProductForm({
  product,
  onSubmit,
  formId = 'admin-product-form',
}: AdminProductFormProps) {
  const form = useAppForm(adminProductFormSchema, {
    defaultValues: product
      ? (productToFormValues(product) as AdminProductFormSchema)
      : (createEmptyProductDefaults() as AdminProductFormSchema),
  });

  return (
    <Form form={form} id={formId} onSubmit={form.handleSubmit(onSubmit)}>
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
        <TabsContent value="basic">
          <AdminProductFormBasic />
        </TabsContent>
        <TabsContent value="classification">
          <AdminProductFormClassification />
        </TabsContent>
        <TabsContent value="pricing">
          <AdminProductFormPricing />
        </TabsContent>
        <TabsContent value="variations">
          <AdminProductFormVariations />
        </TabsContent>
        <TabsContent value="gallery">
          <AdminProductFormGallery />
        </TabsContent>
        <TabsContent value="seo">
          <AdminProductFormSeo />
        </TabsContent>
        <TabsContent value="flags">
          <AdminProductFormFlags />
        </TabsContent>
      </Tabs>
    </Form>
  );
});
