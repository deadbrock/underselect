'use client';

import Link from 'next/link';
import { use } from 'react';

import { AdminProductDetailView } from '@presentation/components/admin/product';
import { Button } from '@presentation/components/ui';
import { useProductStore } from '@presentation/stores/admin/product';

interface ProdutoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export default function ProdutoDetalhePage({
  params,
}: ProdutoDetalhePageProps) {
  const { id } = use(params);
  const product = useProductStore((s) => s.getProductById(id));

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/produtos">Voltar aos produtos</Link>
        </Button>
      </div>
    );
  }

  return <AdminProductDetailView product={product} />;
}
