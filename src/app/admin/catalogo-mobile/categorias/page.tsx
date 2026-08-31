import {
  CatalogMobileShell,
  CatalogMobileTaxonomy,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Categorias',
  description: 'Gestão simplificada de categorias UNDER SELECT.',
  path: '/admin/catalogo-mobile/categorias',
});

export default function CatalogoMobileCategoriasPage() {
  return (
    <CatalogMobileShell
      title="Categorias"
      description="Organize as categorias do catálogo."
    >
      <CatalogMobileTaxonomy
        endpoint="/api/admin/categories"
        nameLabel="Categoria"
        showSlugField
        showDescriptionField
      />
    </CatalogMobileShell>
  );
}
