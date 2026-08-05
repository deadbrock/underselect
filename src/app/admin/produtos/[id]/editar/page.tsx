import { AdminProductFormPage } from '@presentation/components/admin/product';
import { createPrivatePageMetadata } from '@shared/seo';

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditarProdutoPageProps) {
  const { id } = await params;
  return createPrivatePageMetadata({
    title: 'Editar Produto',
    description: `Editar produto ${id} UNDER SELECT.`,
    path: `/admin/produtos/${id}/editar`,
  });
}

export default async function EditarProdutoPage({
  params,
}: EditarProdutoPageProps) {
  const { id } = await params;
  return <AdminProductFormPage mode="edit" productId={id} />;
}
