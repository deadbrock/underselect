import {
  CatalogMobileShell,
  CatalogMobileTaxonomy,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Times',
  description: 'Gestão simplificada de times UNDER SELECT.',
  path: '/admin/catalogo-mobile/times',
});

export default function CatalogoMobileTimesPage() {
  return (
    <CatalogMobileShell
      title="Times"
      description="Cadastre os times do catálogo."
    >
      <CatalogMobileTaxonomy endpoint="/api/admin/teams" nameLabel="Time" />
    </CatalogMobileShell>
  );
}
