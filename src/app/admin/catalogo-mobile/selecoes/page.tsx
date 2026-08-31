import {
  CatalogMobileShell,
  CatalogMobileTaxonomy,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Seleções',
  description: 'Gestão simplificada de seleções UNDER SELECT.',
  path: '/admin/catalogo-mobile/selecoes',
});

export default function CatalogoMobileSelecoesPage() {
  return (
    <CatalogMobileShell
      title="Seleções"
      description="Cadastre as seleções do catálogo."
    >
      <CatalogMobileTaxonomy
        endpoint="/api/admin/selections"
        nameLabel="Seleção"
      />
    </CatalogMobileShell>
  );
}
