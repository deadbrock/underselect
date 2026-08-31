import {
  CatalogMobileProductList,
  CatalogMobileShell,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Catálogo mobile',
  description: 'Gestão simplificada de produtos UNDER SELECT.',
  path: '/admin/catalogo-mobile',
});

export default function CatalogoMobilePage() {
  return (
    <CatalogMobileShell
      title="Produtos"
      description="Cadastre com fotos, descrição, tamanhos, quantidade e valor."
    >
      <CatalogMobileProductList />
    </CatalogMobileShell>
  );
}
