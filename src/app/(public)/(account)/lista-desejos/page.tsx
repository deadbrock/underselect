import { AccountWishlistGrid } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Lista de Desejos',
  description: 'Salve produtos para comprar depois na UNDER SELECT.',
  path: '/lista-desejos',
});

export default function ListaDesejosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Lista de Desejos',
            description: 'Lista de desejos UNDER SELECT.',
            path: '/lista-desejos',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Lista de Desejos', path: '/lista-desejos' },
          ]),
        ]}
      />
      <AccountWishlistGrid />
    </>
  );
}
