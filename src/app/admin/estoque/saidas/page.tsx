import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockExitForm = dynamic(
  () =>
    import('@presentation/components/admin/stock').then((m) => m.StockExitForm),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Saídas',
  description: 'Registrar saídas de estoque.',
  path: '/admin/estoque/saidas',
});

export default function EstoqueSaidasPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Saída de Estoque',
            description: 'Registrar saídas de estoque.',
            path: '/admin/estoque/saidas',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Saídas', path: '/admin/estoque/saidas' },
          ]),
        ]}
      />
      <StockExitForm />
    </>
  );
}
