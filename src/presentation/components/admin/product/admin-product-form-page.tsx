'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

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
  const fetchProductById = useProductStore((s) => s.fetchProductById);
  const createProduct = useProductStore((s) => s.createProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && productId) {
      setIsLoading(true);
      void fetchProductById(productId).finally(() => setIsLoading(false));
    }
  }, [mode, productId, fetchProductById]);

  const onSubmit = useCallback(
    async (values: AdminProductFormSchema) => {
      const input = formValuesToProductInput(values);
      setIsSubmitting(true);
      try {
        if (mode === 'create') {
          const created = await createProduct(input);
          toast.success('Produto criado com sucesso.');
          router.push(`/admin/produtos/${created.id}/editar`);
          return;
        }
        if (productId) {
          await updateProduct(productId, input);
          toast.success('Produto atualizado.');
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao salvar produto.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, createProduct, updateProduct, productId, router],
  );

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Carregando produto...</p>
      </div>
    );
  }

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
        description="Cadastro completo com variações, galeria e SEO. Produtos ativos aparecem na loja."
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar produto'}
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
