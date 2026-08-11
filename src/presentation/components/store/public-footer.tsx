'use client';

import Link from 'next/link';
import type { Route } from 'next';

import { Separator } from '@presentation/components/ui';
import { Container } from '@presentation/components/layout';
import { NewsletterForm } from '@presentation/components/store/newsletter-form';
import { useStoreSettings } from '@presentation/contexts/store-settings-context';
import {
  FOOTER_ACCOUNT,
  FOOTER_POLICIES,
  FOOTER_SUPPORT,
} from '@shared/constants/store-navigation';

interface FooterColumnProps {
  title: string;
  links: { label: string; href: Route | string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-label text-muted-foreground mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href as Route}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  const settings = useStoreSettings();
  const year = new Date().getFullYear();
  const socialLinks = settings.instagramUrl
    ? [{ label: 'Instagram', href: settings.instagramUrl }]
    : [];

  return (
    <footer className="border-border bg-brand-gray-100 dark:bg-brand-gray-900 mt-auto border-t">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Link
              href="/"
              className="text-foreground inline-block text-sm font-medium tracking-[0.25em] uppercase"
            >
              {settings.storeName}
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              Camisas esportivas de primeira linha. Clubes, seleções e edições
              especiais com acabamento premium para quem leva a paixão a sério.
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
            <FooterColumn title="Políticas" links={FOOTER_POLICIES} />
            <FooterColumn title="Ajuda" links={FOOTER_SUPPORT} />
            <FooterColumn title="Conta" links={FOOTER_ACCOUNT} />
          </div>

          <div className="lg:col-span-3">
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.storeName}. Todos os direitos reservados.
          </p>
          <p className="tracking-wider uppercase">{settings.storeLocation}</p>
        </div>
      </Container>
    </footer>
  );
}
