import Link from 'next/link';

import { PagePlaceholder } from '@presentation/components/store';

export default function PublicNotFoundPage() {
  return (
    <PagePlaceholder
      title="Página não encontrada"
      description="A página que você procura não existe ou foi movida."
      breadcrumbs={[{ label: 'Início', href: '/' }]}
    >
      <div className="mt-4">
        <Link href="/" className="text-label text-brand-bronze hover:underline">
          Voltar ao início
        </Link>
      </div>
    </PagePlaceholder>
  );
}
