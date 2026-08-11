'use client';

import { Container } from '@presentation/components/layout';
import { useStoreSettings } from '@presentation/contexts/store-settings-context';

export function MaintenancePage() {
  const settings = useStoreSettings();

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-label text-muted-foreground mb-3">Manutenção</p>
      <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
        {settings.storeName}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed">
        Estamos realizando ajustes na loja e voltaremos em breve. Para
        urgências, entre em contato pelo e-mail{' '}
        <a
          href={`mailto:${settings.contactEmail}`}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {settings.contactEmail}
        </a>
        .
      </p>
    </Container>
  );
}
