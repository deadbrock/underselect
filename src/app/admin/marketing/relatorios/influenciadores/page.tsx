import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const InfluencerReports = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.InfluencerReports,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Relatório de Influenciadores',
  description: 'Relatório de influenciadores UNDER SELECT.',
  path: '/admin/marketing/relatorios/influenciadores',
});

export default function RelatorioInfluenciadoresPage() {
  return <InfluencerReports />;
}
