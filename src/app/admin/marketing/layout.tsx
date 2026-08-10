import { MarketingLayoutNav } from '@presentation/components/admin/marketing';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingLayoutNav />
      {children}
    </>
  );
}
