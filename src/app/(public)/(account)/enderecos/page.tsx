import { AccountAddressesManager } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Endereços',
  description: 'Gerencie seus endereços de entrega na UNDER SELECT.',
  path: '/enderecos',
});

export default function EnderecosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Endereços',
            description: 'Endereços de entrega UNDER SELECT.',
            path: '/enderecos',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Endereços', path: '/enderecos' },
          ]),
        ]}
      />
      <AccountAddressesManager />
    </>
  );
}
