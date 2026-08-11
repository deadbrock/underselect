'use client';

import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';

import {
  Form,
  FormField,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import { useStockStore } from '@presentation/stores/admin/stock';
import {
  stockAdjustmentSchema,
  type StockAdjustmentSchema,
} from '@presentation/stores/admin/stock/stock.schemas';
import { STOCK_ADJUSTMENT_REASONS } from '@shared/constants/stock.constants';

import { stockItemSelectField } from './stock-item-select';

const MODE_OPTIONS = [
  { value: 'add', label: 'Adicionar unidades' },
  { value: 'remove', label: 'Remover unidades' },
  { value: 'set', label: 'Corrigir quantidade' },
] as const;

export const StockAdjustmentForm = memo(function StockAdjustmentForm() {
  const router = useRouter();
  const stockItems = useStockStore((s) => s.stockItems);
  const registerAdjustment = useStockStore((s) => s.registerAdjustment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm<StockAdjustmentSchema>(stockAdjustmentSchema, {
    defaultValues: {
      stockItemId: '',
      mode: 'add',
      quantity: 1,
      reason: STOCK_ADJUSTMENT_REASONS[0],
      notes: '',
    },
  });

  const selectedId = form.watch('stockItemId');
  const selectedItem = stockItems.find((i) => i.id === selectedId);

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await registerAdjustment(values);
      toast.success('Ajuste registrado com sucesso.');
      form.reset({
        stockItemId: '',
        mode: 'add',
        quantity: 1,
        reason: STOCK_ADJUSTMENT_REASONS[0],
        notes: '',
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao aplicar ajuste.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ajuste de Estoque"
        description="Adicione, remova ou corrija quantidades — persiste no banco e registra no histórico."
      />

      <Form form={form} onSubmit={onSubmit} className="max-w-xl">
        <FormSection title="Item">
          <FormField
            name="stockItemId"
            label="Produto / Variação"
            render={({ field }) => stockItemSelectField(stockItems, field)}
          />
          {selectedItem && (
            <p className="text-muted-foreground text-sm">
              Saldo atual:{' '}
              <span className="text-foreground font-medium tabular-nums">
                {selectedItem.quantity}
              </span>
            </p>
          )}
        </FormSection>

        <FormSection title="Ajuste">
          <FormField
            name="mode"
            label="Tipo de ajuste"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormInput name="quantity" label="Quantidade" type="number" min={0} />
          <FormField
            name="reason"
            label="Motivo"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_ADJUSTMENT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormField
            name="notes"
            label="Observação"
            render={({ field }) => (
              <Textarea {...field} rows={3} placeholder="Opcional" />
            )}
          />
        </FormSection>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            className="min-h-10 flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Aplicar ajuste'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-10"
            onClick={() => router.push('/admin/estoque/movimentacoes')}
          >
            Ver histórico
          </Button>
        </div>
      </Form>
    </div>
  );
});
