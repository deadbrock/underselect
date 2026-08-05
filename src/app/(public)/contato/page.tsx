import { PagePlaceholder } from '@presentation/components/store';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Contato',
  description:
    'Entre em contato com a UNDER SELECT. Atendimento premium e personalizado.',
  path: '/contato',
});

export default function ContatoPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Contato',
            description: 'Contato UNDER SELECT.',
            path: '/contato',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Contato', path: '/contato' },
          ]),
        ]}
      />
      <PagePlaceholder
        title="Contato"
        description="Estrutura preparada para formulário, canais e informações de atendimento."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Contato' }]}
      />
    </>
  );
}
