import { AccountProfileForm } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Dados Pessoais',
  description: 'Atualize seus dados pessoais na UNDER SELECT.',
  path: '/dados-pessoais',
});

export default function DadosPessoaisPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Dados Pessoais',
            description: 'Perfil do cliente UNDER SELECT.',
            path: '/dados-pessoais',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Dados Pessoais', path: '/dados-pessoais' },
          ]),
        ]}
      />
      <AccountProfileForm />
    </>
  );
}
