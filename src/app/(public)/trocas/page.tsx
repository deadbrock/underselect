import { PagePlaceholder } from '@presentation/components/store';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Trocas e Devoluções',
  description:
    'Política de trocas e devoluções UNDER SELECT. Processo simples e transparente.',
  path: '/trocas',
});

export default function TrocasPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Trocas e Devoluções',
            description: 'Política de trocas UNDER SELECT.',
            path: '/trocas',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Trocas', path: '/trocas' },
          ]),
        ]}
      />
      <PagePlaceholder
        title="Trocas e Devoluções"
        description="Estrutura preparada para políticas, prazos e instruções."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Trocas' }]}
      />
    </>
  );
}
