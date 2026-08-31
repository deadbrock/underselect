import {
  CatalogMobileShell,
  CatalogMobileTaxonomy,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Coleções',
  description: 'Gestão simplificada de coleções UNDER SELECT.',
  path: '/admin/catalogo-mobile/colecoes',
});

export default function CatalogoMobileColecoesPage() {
  return (
    <CatalogMobileShell
      title="Coleções"
      description="Crie coleções para classificar os produtos."
    >
      <CatalogMobileTaxonomy
        endpoint="/api/admin/collections"
        nameLabel="Coleção"
        showDescriptionField
      />
    </CatalogMobileShell>
  );
}
