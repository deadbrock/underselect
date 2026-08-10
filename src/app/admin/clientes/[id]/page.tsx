'use client';

import Link from 'next/link';
import { use } from 'react';

import { CustomerDetail } from '@presentation/components/admin/customer';
import { Button } from '@presentation/components/ui';
import { useCustomerStore } from '@presentation/stores/admin/customer';

interface ClienteDetalhePageProps {
  params: Promise<{ id: string }>;
}

export default function ClienteDetalhePage({
  params,
}: ClienteDetalhePageProps) {
  const { id } = use(params);
  const customer = useCustomerStore((s) => s.getCustomerById(id));

  if (!customer) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <Button asChild className="mt-4 min-h-10">
          <Link href="/admin/clientes/lista">Voltar aos clientes</Link>
        </Button>
      </div>
    );
  }

  return <CustomerDetail customer={customer} />;
}
