import { AccountFavoritesGrid } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Favoritos',
  description: 'Seus produtos favoritos na UNDER SELECT.',
  path: '/favoritos',
});

export default function FavoritosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Favoritos',
            description: 'Favoritos UNDER SELECT.',
            path: '/favoritos',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Favoritos', path: '/favoritos' },
          ]),
        ]}
      />
      <AccountFavoritesGrid />
    </>
  );
}
