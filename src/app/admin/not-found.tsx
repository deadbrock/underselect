import Link from 'next/link';

import { Button } from '@presentation/components/ui';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-muted-foreground text-[0.625rem] tracking-[0.3em] uppercase">
        Erro 404
      </p>
      <h1 className="text-3xl font-medium tracking-tight">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        A página administrativa que você procura não existe ou foi movida.
      </p>
      <Button asChild className="min-h-11">
        <Link href="/admin/dashboard">Voltar ao Dashboard</Link>
      </Button>
    </div>
  );
}
