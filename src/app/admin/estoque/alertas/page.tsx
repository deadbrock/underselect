import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockAlertsPanel = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockAlertsPanel,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Alertas',
  description: 'Alertas de estoque baixo, ruptura e excesso.',
  path: '/admin/estoque/alertas',
});

export default function EstoqueAlertasPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Alertas de Estoque',
            description: 'Alertas de estoque baixo, ruptura e excesso.',
            path: '/admin/estoque/alertas',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Alertas', path: '/admin/estoque/alertas' },
          ]),
        ]}
      />
      <StockAlertsPanel />
    </>
  );
}
