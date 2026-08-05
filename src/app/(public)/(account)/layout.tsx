import { AccountLayoutShell } from '@presentation/components/account';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayoutShell>{children}</AccountLayoutShell>;
}
