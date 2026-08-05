import { PagePlaceholder } from '@presentation/components/store';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados UNDER SELECT.',
  path: '/politica',
});

export default function PoliticaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Política de Privacidade',
            description: 'Políticas UNDER SELECT.',
            path: '/politica',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Política', path: '/politica' },
          ]),
        ]}
      />
      <PagePlaceholder
        title="Política de Privacidade"
        description="Estrutura preparada para conteúdo institucional e legal."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Política' }]}
      />
    </>
  );
}
