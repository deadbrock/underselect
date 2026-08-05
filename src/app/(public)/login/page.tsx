import { PagePlaceholder } from '@presentation/components/store';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Login',
  description: 'Acesse sua conta UNDER SELECT.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Login',
            description: 'Login UNDER SELECT.',
            path: '/login',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Login', path: '/login' },
          ]),
        ]}
      />
      <PagePlaceholder
        title="Login"
        description="Estrutura preparada para autenticação e recuperação de senha."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Login' }]}
      />
    </>
  );
}
