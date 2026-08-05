import { AccountPasswordForm } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Alterar Senha',
  description: 'Altere sua senha com segurança na UNDER SELECT.',
  path: '/alterar-senha',
});

export default function AlterarSenhaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Alterar Senha',
            description: 'Alteração de senha UNDER SELECT.',
            path: '/alterar-senha',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Alterar Senha', path: '/alterar-senha' },
          ]),
        ]}
      />
      <AccountPasswordForm />
    </>
  );
}
