import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const InfluencerList = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.InfluencerList,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Influenciadores',
  description: 'Gerencie parceiros e códigos UNDER SELECT.',
  path: '/admin/marketing/influenciadores',
});

export default function InfluenciadoresPage() {
  return <InfluencerList />;
}
