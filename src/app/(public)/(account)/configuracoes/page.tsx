import { AccountSettingsForm } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Configurações',
  description: 'Preferências da sua conta UNDER SELECT.',
  path: '/configuracoes',
});

export default function ConfiguracoesPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Configurações',
            description: 'Configurações da conta UNDER SELECT.',
            path: '/configuracoes',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Configurações', path: '/configuracoes' },
          ]),
        ]}
      />
      <AccountSettingsForm />
    </>
  );
}
