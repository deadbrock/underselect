import {
  HomeHero,
  HomeCategories,
  HomeProductSection,
  HomePromotions,
  HomeBenefits,
  HomeNewsletter,
} from '@presentation/components/home';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createWebSiteSchema,
} from '@shared/seo';
import {
  HOME_FEATURED_PRODUCTS,
  HOME_NEW_ARRIVALS,
} from '@shared/mocks/home.data';

export const metadata = createPageMetadata({
  title: 'Início',
  description:
    'UNDER SELECT — Camisas oficiais de clubes brasileiros, seleções nacionais, retrô e casual esportiva.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          createWebSiteSchema(),
          createWebPageSchema({
            name: 'Início',
            description:
              'UNDER SELECT — Conforto, estilo e qualidade para você.',
            path: '/',
          }),
        ]}
      />

      <HomeHero />

      <HomeCategories />

      <HomeProductSection
        eyebrow="Destaques"
        title="Mais vendidas"
        description="Camisas de clubes e seleções que lideram os acessos."
        products={HOME_FEATURED_PRODUCTS}
      />

      <HomeProductSection
        eyebrow="Novidades"
        title="Lançamentos da temporada"
        description="Novos modelos de times e seleções recém-chegados."
        products={HOME_NEW_ARRIVALS}
      />

      <HomePromotions />

      <HomeBenefits />

      <HomeNewsletter />
    </>
  );
}
