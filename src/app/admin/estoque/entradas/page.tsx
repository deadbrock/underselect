import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockEntryForm = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockEntryForm,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Entradas',
  description: 'Registrar entradas de estoque.',
  path: '/admin/estoque/entradas',
});

export default function EstoqueEntradasPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Entrada de Estoque',
            description: 'Registrar entradas de estoque.',
            path: '/admin/estoque/entradas',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Entradas', path: '/admin/estoque/entradas' },
          ]),
        ]}
      />
      <StockEntryForm />
    </>
  );
}
