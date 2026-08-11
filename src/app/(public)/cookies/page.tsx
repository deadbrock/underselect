import { LegalDocument, PagePlaceholder } from '@presentation/components/store';
import { COOKIE_POLICY } from '@shared/content/legal-documents';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Política de Cookies',
  description: COOKIE_POLICY.description,
  path: '/cookies',
});

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: COOKIE_POLICY.title,
            description: COOKIE_POLICY.description,
            path: '/cookies',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Política de Cookies', path: '/cookies' },
          ]),
        ]}
      />
      <PagePlaceholder
        title={COOKIE_POLICY.title}
        description={COOKIE_POLICY.description}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Política de Cookies' },
        ]}
      >
        <LegalDocument document={COOKIE_POLICY} />
      </PagePlaceholder>
    </>
  );
}
