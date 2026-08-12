import { PublicLayoutShell } from '@presentation/components/store';
import { getStoreSettings } from '@infrastructure/database/repositories/store-settings.repository';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();

  return <PublicLayoutShell settings={settings}>{children}</PublicLayoutShell>;
}
