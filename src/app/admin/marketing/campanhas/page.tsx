import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CampaignList = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CampaignList,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Campanhas',
  description: 'Campanhas de marketing UNDER SELECT.',
  path: '/admin/marketing/campanhas',
});

export default function CampanhasPage() {
  return <CampaignList />;
}
