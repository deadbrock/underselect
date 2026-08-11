import { AdminTaxonomyList } from '@presentation/components/admin/admin-taxonomy-list';
import { createAdminModuleMetadata } from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('categorias'),
);

export default function CategoriasAdminPage() {
  return (
    <AdminTaxonomyList
      title="Categorias"
      description="Gerencie as categorias do catálogo UNDER SELECT."
      endpoint="/api/admin/categories"
      nameLabel="Categoria"
      slugLabel="Slug da categoria"
      showSlugField
      autoSlugFromName
    />
  );
}
