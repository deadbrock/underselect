import { CheckoutExperience } from '@presentation/components/checkout';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Checkout',
  description: 'Finalize sua compra UNDER SELECT com segurança e elegância.',
  path: '/checkout',
});

export default function CheckoutPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Checkout',
            description: 'Checkout UNDER SELECT.',
            path: '/checkout',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Carrinho', path: '/carrinho' },
            { name: 'Checkout', path: '/checkout' },
          ]),
        ]}
      />
      <CheckoutExperience />
    </>
  );
}
