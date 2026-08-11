import { LegalDocument, PagePlaceholder } from '@presentation/components/store';
import { TERMS_OF_USE } from '@shared/content/legal-documents';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Termos de Uso',
  description: TERMS_OF_USE.description,
  path: '/termos',
});

export default function TermosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: TERMS_OF_USE.title,
            description: TERMS_OF_USE.description,
            path: '/termos',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Termos de Uso', path: '/termos' },
          ]),
        ]}
      />
      <PagePlaceholder
        title={TERMS_OF_USE.title}
        description={TERMS_OF_USE.description}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Termos de Uso' },
        ]}
      >
        <LegalDocument document={TERMS_OF_USE} />
      </PagePlaceholder>
    </>
  );
}
