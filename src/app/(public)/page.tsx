import {
  HomeHero,
  HomeCategories,
  HomeProductSection,
  HomePromotions,
  HomeInstitutionalBanner,
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
    'UNDER SELECT — Moda premium com elegância discreta. Descubra peças atemporais de alta qualidade.',
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
            description: 'UNDER SELECT — Moda premium com elegância discreta.',
            path: '/',
          }),
        ]}
      />

      <HomeHero />

      <HomeCategories />

      <HomeProductSection
        eyebrow="Destaques"
        title="Seleção curada"
        description="Peças essenciais escolhidas pela nossa equipe de estilo."
        products={HOME_FEATURED_PRODUCTS}
      />

      <HomeProductSection
        eyebrow="Novidades"
        title="Lançamentos da temporada"
        description="As últimas adições à coleção UNDER SELECT."
        products={HOME_NEW_ARRIVALS}
      />

      <HomePromotions />

      <HomeInstitutionalBanner />

      <HomeBenefits />

      <HomeNewsletter />
    </>
  );
}
