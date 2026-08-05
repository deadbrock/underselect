import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockAdjustmentForm = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockAdjustmentForm,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Ajustes',
  description: 'Ajustar quantidades de estoque.',
  path: '/admin/estoque/ajustes',
});

export default function EstoqueAjustesPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Ajuste de Estoque',
            description: 'Ajustar quantidades de estoque.',
            path: '/admin/estoque/ajustes',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Ajustes', path: '/admin/estoque/ajustes' },
          ]),
        ]}
      />
      <StockAdjustmentForm />
    </>
  );
}
