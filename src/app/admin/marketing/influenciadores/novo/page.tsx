import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const InfluencerFormPage = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.InfluencerFormPage,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Novo Influenciador',
  description: 'Cadastrar influenciador UNDER SELECT.',
  path: '/admin/marketing/influenciadores/novo',
});

export default function NovoInfluenciadorPage() {
  return <InfluencerFormPage mode="create" />;
}
