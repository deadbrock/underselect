import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const MarketingDashboard = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.MarketingDashboard,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Marketing — Resumo',
  description: 'Dashboard de marketing UNDER SELECT.',
  path: '/admin/marketing',
});

export default function MarketingPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Marketing',
            description: 'Dashboard de marketing UNDER SELECT.',
            path: '/admin/marketing',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Marketing', path: '/admin/marketing' },
          ]),
        ]}
      />
      <MarketingDashboard />
    </>
  );
}
