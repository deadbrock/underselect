import { CartExperience } from '@presentation/components/checkout';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Carrinho',
  description: 'Revise os itens selecionados na sua sacola UNDER SELECT.',
  path: '/carrinho',
});

export default function CarrinhoPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Carrinho',
            description: 'Sacola de compras UNDER SELECT.',
            path: '/carrinho',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Carrinho', path: '/carrinho' },
          ]),
        ]}
      />
      <CartExperience />
    </>
  );
}
