import {
  CatalogMobileProductForm,
  CatalogMobileShell,
} from '@presentation/components/admin/catalog-mobile';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Novo produto',
  description: 'Adicionar produto na versão mobile UNDER SELECT.',
  path: '/admin/catalogo-mobile/novo',
});

export default function CatalogoMobileNovoPage() {
  return (
    <CatalogMobileShell
      title="Novo produto"
      description="Preencha os dados essenciais do produto."
    >
      <CatalogMobileProductForm mode="create" />
    </CatalogMobileShell>
  );
}
