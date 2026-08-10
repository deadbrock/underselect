import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CouponReports = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CouponReports,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Relatório de Cupons',
  description: 'Relatório de cupons UNDER SELECT.',
  path: '/admin/marketing/relatorios/cupons',
});

export default function RelatorioCuponsPage() {
  return <CouponReports />;
}
