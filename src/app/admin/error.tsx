'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@presentation/components/ui';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-muted-foreground text-[0.625rem] tracking-[0.3em] uppercase">
        Erro 500
      </p>
      <h1 className="text-3xl font-medium tracking-tight">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        Ocorreu um erro inesperado no painel administrativo. Tente novamente.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset} className="min-h-11">
          Tentar novamente
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/admin/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
