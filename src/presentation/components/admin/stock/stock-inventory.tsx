'use client';

import { memo, useState } from 'react';

import { EmptyState } from '@presentation/components/feedback';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Textarea,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useStockStore } from '@presentation/stores/admin/stock';
import type { InventoryItem } from '@shared/types/stock.types';

const STATUS_LABELS: Record<InventoryItem['status'], string> = {
  pending: 'Pendente',
  counted: 'Conferido',
  adjusted: 'Corrigido',
};

export const StockInventory = memo(function StockInventory() {
  const inventory = useStockStore((s) => s.inventory);
  const updateInventoryCount = useStockStore((s) => s.updateInventoryCount);
  const applyInventoryAdjustment = useStockStore(
    (s) => s.applyInventoryAdjustment,
  );

  if (inventory.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Inventário"
          description="Conferência física, diferenças e correções de estoque."
        />
        <EmptyState
          title="Nenhum item no inventário"
          description="Os itens serão carregados automaticamente a partir do estoque."
          className="py-16"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventário"
        description="Conferência física, diferenças e correções — preparado para auditoria."
      />

      <div className="hidden md:block">
        <Card className="shadow-none">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b text-left">
                  <th className="p-3 font-medium">Produto</th>
                  <th className="p-3 font-medium">SKU</th>
                  <th className="p-3 font-medium">Sistema</th>
                  <th className="p-3 font-medium">Contagem</th>
                  <th className="hidden p-3 font-medium lg:table-cell">Obs.</th>
                  <th className="p-3 font-medium">Diferença</th>
                  <th className="p-3 font-medium">Situação</th>
                  <th className="p-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    onCount={updateInventoryCount}
                    onApply={applyInventoryAdjustment}
                  />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <ul className="space-y-3 md:hidden" aria-label="Inventário">
        {inventory.map((item) => (
          <li key={item.id}>
            <InventoryCard
              item={item}
              onCount={updateInventoryCount}
              onApply={applyInventoryAdjustment}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});

function InventoryRow({
  item,
  onCount,
  onApply,
}: {
  item: InventoryItem;
  onCount: (id: string, counted: number, notes?: string) => void;
  onApply: (id: string) => void;
}) {
  const [counted, setCounted] = useState(String(item.countedQuantity ?? ''));
  const [notes, setNotes] = useState(item.notes ?? '');

  return (
    <tr className="border-border border-b">
      <td className="p-3">
        <p className="font-medium">{item.productName}</p>
        {item.variationLabel && (
          <p className="text-muted-foreground text-xs">{item.variationLabel}</p>
        )}
      </td>
      <td className="p-3 font-mono text-xs">{item.sku}</td>
      <td className="p-3 tabular-nums">{item.systemQuantity}</td>
      <td className="p-3">
        <Input
          type="number"
          min={0}
          value={counted}
          onChange={(e) => setCounted(e.target.value)}
          className="h-9 w-24"
          aria-label={`Contagem ${item.sku}`}
        />
      </td>
      <td className="hidden p-3 lg:table-cell">
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-9 min-w-[120px]"
          placeholder="Obs."
          aria-label={`Observações ${item.sku}`}
        />
      </td>
      <td className="p-3 tabular-nums">
        {item.difference !== undefined ? (
          <span
            className={
              item.difference !== 0 ? 'text-destructive font-medium' : ''
            }
          >
            {item.difference > 0 ? '+' : ''}
            {item.difference}
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="p-3">
        <Badge variant="secondary">{STATUS_LABELS[item.status]}</Badge>
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onCount(item.id, Number(counted) || 0, notes || undefined)
            }
          >
            Conferir
          </Button>
          {item.status === 'counted' && item.difference !== 0 && (
            <Button type="button" size="sm" onClick={() => onApply(item.id)}>
              Corrigir
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function InventoryCard({
  item,
  onCount,
  onApply,
}: {
  item: InventoryItem;
  onCount: (id: string, counted: number, notes?: string) => void;
  onApply: (id: string) => void;
}) {
  const [counted, setCounted] = useState(String(item.countedQuantity ?? ''));
  const [notes, setNotes] = useState(item.notes ?? '');

  return (
    <Card className="shadow-none">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{item.productName}</p>
            <p className="text-muted-foreground font-mono text-xs">
              {item.sku}
            </p>
          </div>
          <Badge variant="secondary">{STATUS_LABELS[item.status]}</Badge>
        </div>
        <p className="text-sm">
          Sistema: <span className="tabular-nums">{item.systemQuantity}</span>
        </p>
        <div className="space-y-2">
          <label className="text-sm" htmlFor={`count-${item.id}`}>
            Contagem física
          </label>
          <Input
            id={`count-${item.id}`}
            type="number"
            min={0}
            value={counted}
            onChange={(e) => setCounted(e.target.value)}
            className="h-10"
          />
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Observações"
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            className="min-h-10"
            variant="outline"
            onClick={() =>
              onCount(item.id, Number(counted) || 0, notes || undefined)
            }
          >
            Conferir
          </Button>
          {item.status === 'counted' && item.difference !== 0 && (
            <Button
              type="button"
              className="min-h-10"
              onClick={() => onApply(item.id)}
            >
              Aplicar correção
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
