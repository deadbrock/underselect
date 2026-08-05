import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockInventory = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockInventory,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Inventário',
  description: 'Conferência e correção de inventário.',
  path: '/admin/estoque/inventario',
});

export default function EstoqueInventarioPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Inventário de Estoque',
            description: 'Conferência e correção de inventário.',
            path: '/admin/estoque/inventario',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Inventário', path: '/admin/estoque/inventario' },
          ]),
        ]}
      />
      <StockInventory />
    </>
  );
}
