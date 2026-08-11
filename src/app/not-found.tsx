import Link from 'next/link';

import {
  PagePlaceholder,
  PublicLayoutShell,
} from '@presentation/components/store';
import { getStoreSettings } from '@infrastructure/database/repositories/store-settings.repository';

export default async function NotFoundPage() {
  const settings = await getStoreSettings();

  return (
    <PublicLayoutShell settings={settings}>
      <PagePlaceholder
        title="Página não encontrada"
        description="A página que você procura não existe ou foi movida."
        breadcrumbs={[{ label: 'Início', href: '/' }]}
      >
        <div className="mt-4">
          <Link
            href="/"
            className="text-label text-brand-bronze hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </PagePlaceholder>
    </PublicLayoutShell>
  );
}
