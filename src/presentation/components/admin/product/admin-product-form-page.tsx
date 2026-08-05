'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';

import { PageHeader } from '@presentation/components/layout';
import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import {
  useProductStore,
  formValuesToProductInput,
  type AdminProductFormSchema,
} from '@presentation/stores/admin/product';

import { AdminProductForm } from './admin-product-form';

export interface AdminProductFormPageProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export const AdminProductFormPage = memo(function AdminProductFormPage({
  mode,
  productId,
}: AdminProductFormPageProps) {
  const router = useRouter();
  const product = useProductStore((s) =>
    productId ? s.getProductById(productId) : undefined,
  );
  const createProduct = useProductStore((s) => s.createProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const onSubmit = useCallback(
    (values: AdminProductFormSchema) => {
      const input = formValuesToProductInput(values);
      if (mode === 'create') {
        const created = createProduct(input);
        toast.success('Produto criado com sucesso.');
        router.push(`/admin/produtos/${created.id}/editar`);
        return;
      }
      if (productId) {
        updateProduct(productId, input);
        toast.success('Produto atualizado.');
      }
    },
    [mode, createProduct, updateProduct, productId, router],
  );

  if (mode === 'edit' && productId && !product) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/produtos">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          mode === 'create' ? 'Novo produto' : `Editar — ${product?.name ?? ''}`
        }
        description="Cadastro completo com variações, galeria e SEO."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              asChild
              className="min-h-11"
            >
              <Link href="/admin/produtos">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              form="admin-product-form"
              className="min-h-11"
            >
              Salvar produto
            </Button>
          </div>
        }
      />
      <AdminProductForm
        key={product?.id ?? 'new'}
        product={product}
        onSubmit={onSubmit}
      />
    </div>
  );
});
