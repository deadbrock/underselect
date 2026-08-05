'use client';

import { ErrorFallback } from '@presentation/components/feedback';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="pt-BR">
      <body>
        <ErrorFallback
          title="Erro crítico"
          message={error.message || 'Ocorreu um erro inesperado no sistema.'}
          reset={reset}
        />
      </body>
    </html>
  );
}
