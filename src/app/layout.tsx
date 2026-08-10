import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AppProviders } from '@presentation/providers';
import '@presentation/styles/globals.css';
import { env } from '@infrastructure/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'UNDER SELECT',
    template: '%s | UNDER SELECT',
  },
  description:
    'UNDER SELECT — Camisas esportivas de primeira linha. Clubes, seleções e edições premium.',
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
