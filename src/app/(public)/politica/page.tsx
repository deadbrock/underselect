import { LegalDocument, PagePlaceholder } from '@presentation/components/store';
import { PRIVACY_POLICY } from '@shared/content/legal-documents';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Política de Privacidade',
  description: PRIVACY_POLICY.description,
  path: '/politica',
});

export default function PoliticaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: PRIVACY_POLICY.title,
            description: PRIVACY_POLICY.description,
            path: '/politica',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Política de Privacidade', path: '/politica' },
          ]),
        ]}
      />
      <PagePlaceholder
        title={PRIVACY_POLICY.title}
        description={PRIVACY_POLICY.description}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Política de Privacidade' },
        ]}
      >
        <LegalDocument document={PRIVACY_POLICY} />
      </PagePlaceholder>
    </>
  );
}
