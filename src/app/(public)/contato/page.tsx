import { Container } from '@presentation/components/layout';
import { Breadcrumb } from '@presentation/components/ui';
import { getStoreSettings } from '@infrastructure/database/repositories/store-settings.repository';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPageMetadata({
  title: 'Contato',
  description:
    'Entre em contato com a UNDER SELECT. Atendimento premium e personalizado.',
  path: '/contato',
});

export default async function ContatoPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Contato',
            description: 'Contato UNDER SELECT.',
            path: '/contato',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Contato', path: '/contato' },
          ]),
        ]}
      />
      <Container className="py-10 md:py-14">
        <Breadcrumb
          items={[{ label: 'Início', href: '/' }, { label: 'Contato' }]}
          className="mb-8"
        />

        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Contato
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fale com a {settings.storeName}. Estamos em{' '}
              {settings.storeLocation}.
            </p>
          </div>

          <dl className="border-border grid gap-4 border p-6 text-sm">
            <div>
              <dt className="text-muted-foreground mb-1">E-mail</dt>
              <dd>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:underline"
                >
                  {settings.contactEmail}
                </a>
              </dd>
            </div>
            {settings.contactPhone ? (
              <div>
                <dt className="text-muted-foreground mb-1">Telefone</dt>
                <dd>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\D/g, '')}`}
                    className="hover:underline"
                  >
                    {settings.contactPhone}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground mb-1">Localização</dt>
              <dd>{settings.storeLocation}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-1">Prazo de entrega</dt>
              <dd>{settings.estimatedDelivery}</dd>
            </div>
            {settings.instagramUrl ? (
              <div>
                <dt className="text-muted-foreground mb-1">Instagram</dt>
                <dd>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Container>
    </>
  );
}
