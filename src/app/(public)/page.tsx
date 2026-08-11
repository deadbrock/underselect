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
  fetchBestSellerProducts,
  fetchNewProducts,
} from '@shared/services/catalog.service';

export const metadata = createPageMetadata({
  title: 'Início',
  description:
    'UNDER SELECT — Camisas oficiais de clubes brasileiros, seleções nacionais, retrô e casual esportiva.',
  path: '/',
});

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    fetchBestSellerProducts(),
    fetchNewProducts(),
  ]);

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
        products={featuredProducts}
      />

      <HomeProductSection
        eyebrow="Novidades"
        title="Lançamentos da temporada"
        description="Novos modelos de times e seleções recém-chegados."
        products={newArrivals}
      />

      <HomePromotions />

      <HomeBenefits />

      <HomeNewsletter />
    </>
  );
}
