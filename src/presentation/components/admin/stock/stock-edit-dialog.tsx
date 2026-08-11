'use client';

import { memo, useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@presentation/components/ui';
import type { StockItem } from '@shared/types/stock.types';

export interface StockEditDialogProps {
  item: StockItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: { stock: number; minStock: number }) => Promise<void>;
  isSaving?: boolean;
}

export const StockEditDialog = memo(function StockEditDialog({
  item,
  open,
  onOpenChange,
  onSave,
  isSaving = false,
}: StockEditDialogProps) {
  const [stock, setStock] = useState(String(item.quantity));
  const [minStock, setMinStock] = useState(String(item.minQuantity));

  useEffect(() => {
    if (open) {
      setStock(String(item.quantity));
      setMinStock(String(item.minQuantity));
    }
  }, [open, item.quantity, item.minQuantity]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({
      stock: Number(stock),
      minStock: Number(minStock),
    });
  };

  const variationLabel = [item.size, item.color].filter(Boolean).join(' · ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar estoque</DialogTitle>
          <DialogDescription>
            {item.productName}
            {variationLabel ? ` — ${variationLabel}` : ''}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-2">
            <Label htmlFor="stock-qty">Quantidade em estoque</Label>
            <Input
              id="stock-qty"
              type="number"
              min={0}
              inputMode="numeric"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock-min">Quantidade mínima</Label>
            <Input
              id="stock-min"
              type="number"
              min={0}
              inputMode="numeric"
              value={minStock}
              onChange={(event) => setMinStock(event.target.value)}
              required
            />
            <p className="text-muted-foreground text-xs">
              Alertas de estoque baixo usam este valor como referência.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar estoque'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
