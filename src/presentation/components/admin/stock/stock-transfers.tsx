'use client';

import { ArrowLeftRight } from 'lucide-react';
import { memo } from 'react';

import { EmptyState } from '@presentation/components/feedback';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';

export const StockTransfers = memo(function StockTransfers() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transferências"
        description="Movimentação entre depósitos e filiais — estrutura preparada para integração."
      />

      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <ArrowLeftRight
            className="text-muted-foreground size-12"
            aria-hidden
          />
          <EmptyState
            title="Módulo em preparação"
            description="Transferências entre locais, leitor de código de barras e integração com filiais estarão disponíveis em breve."
            className="py-0"
          />
          <ul className="text-muted-foreground max-w-md space-y-1 text-left text-xs">
            <li>• Origem e destino de depósito</li>
            <li>• Rastreabilidade completa no histórico</li>
            <li>• Integração com pedidos e automações</li>
            <li>• Importação por Excel / CSV</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
});
