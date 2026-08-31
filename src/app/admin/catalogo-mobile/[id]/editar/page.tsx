import {
  CatalogMobileProductForm,
  CatalogMobileShell,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

interface CatalogoMobileEditarPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CatalogoMobileEditarPageProps) {
  const { id } = await params;
  return createPrivatePageMetadata({
    title: 'Editar produto',
    description: `Editar produto ${id} na versão mobile UNDER SELECT.`,
    path: `/admin/catalogo-mobile/${id}/editar`,
  });
}

export default async function CatalogoMobileEditarPage({
  params,
}: CatalogoMobileEditarPageProps) {
  const { id } = await params;

  return (
    <CatalogMobileShell
      title="Editar produto"
      description="Atualize dados, vínculos, tamanhos e valor."
    >
      <CatalogMobileProductForm mode="edit" productId={id} />
    </CatalogMobileShell>
  );
}
