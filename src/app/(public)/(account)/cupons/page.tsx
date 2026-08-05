import { AccountCouponsPanel } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Cupons',
  description: 'Cupons e benefícios exclusivos na UNDER SELECT.',
  path: '/cupons',
});

export default function CuponsPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Cupons',
            description: 'Cupons UNDER SELECT.',
            path: '/cupons',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Cupons', path: '/cupons' },
          ]),
        ]}
      />
      <AccountCouponsPanel />
    </>
  );
}
