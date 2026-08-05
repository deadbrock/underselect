import { PagePlaceholder } from '@presentation/components/store';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Cadastro',
  description: 'Crie sua conta UNDER SELECT e aproveite benefícios exclusivos.',
  path: '/cadastro',
});

export default function CadastroPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Cadastro',
            description: 'Cadastro no site UNDER SELECT.',
            path: '/cadastro',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Cadastro', path: '/cadastro' },
          ]),
        ]}
      />
      <PagePlaceholder
        title="Cadastro"
        description="Estrutura preparada para formulário de criação de conta."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Cadastro' }]}
      />
    </>
  );
}
