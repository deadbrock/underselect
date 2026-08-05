import { AdminProductList } from '@presentation/components/admin/product';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Produtos',
  description: 'Gestão completa de produtos UNDER SELECT.',
  path: '/admin/produtos',
});

export default function ProdutosAdminPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Produtos',
            description: 'Gestão de produtos UNDER SELECT.',
            path: '/admin/produtos',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Produtos', path: '/admin/produtos' },
          ]),
        ]}
      />
      <AdminProductList />
    </>
  );
}
