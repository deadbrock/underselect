import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockList = dynamic(
  () => import('@presentation/components/admin/stock').then((m) => m.StockList),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Produtos',
  description: 'Listagem de produtos em estoque por variação.',
  path: '/admin/estoque/produtos',
});

export default function EstoqueProdutosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Produtos em Estoque',
            description: 'Listagem de produtos em estoque por variação.',
            path: '/admin/estoque/produtos',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Produtos', path: '/admin/estoque/produtos' },
          ]),
        ]}
      />
      <StockList />
    </>
  );
}
