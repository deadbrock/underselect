import { AdminProductFormPage } from '@presentation/components/admin/product';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Novo Produto',
  description: 'Cadastrar novo produto UNDER SELECT.',
  path: '/admin/produtos/novo',
});

export default function NovoProdutoPage() {
  return <AdminProductFormPage mode="create" />;
}
