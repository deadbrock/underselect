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
import { useStockStore } from '@presentation/stores/admin/stock';
import {
  stockEntrySchema,
  type StockEntrySchema,
} from '@presentation/stores/admin/stock/stock.schemas';
import { STOCK_ENTRY_REASONS } from '@shared/constants/stock.constants';

import { stockItemSelectField } from './stock-item-select';

export const StockEntryForm = memo(function StockEntryForm() {
  const router = useRouter();
  const stockItems = useStockStore((s) => s.stockItems);
  const registerEntry = useStockStore((s) => s.registerEntry);
  const [success, setSuccess] = useState(false);

  const form = useAppForm<StockEntrySchema>(stockEntrySchema, {
    defaultValues: {
      stockItemId: '',
      quantity: 1,
      reason: STOCK_ENTRY_REASONS[0],
      notes: '',
      supplier: '',
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    registerEntry(values);
    setSuccess(true);
    form.reset({
      stockItemId: '',
      quantity: 1,
      reason: STOCK_ENTRY_REASONS[0],
      notes: '',
      supplier: '',
      date: new Date().toISOString().slice(0, 10),
    });
    setTimeout(() => setSuccess(false), 3000);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entrada de Estoque"
        description="Registre recebimentos e reposições — gera histórico automático."
      />

      <Form form={form} onSubmit={onSubmit} className="max-w-xl">
        <FormSection title="Item">
          <FormField
            name="stockItemId"
            label="Produto / Variação"
            render={({ field }) => stockItemSelectField(stockItems, field)}
          />
          <FormInput name="quantity" label="Quantidade" type="number" min={1} />
        </FormSection>

        <FormSection title="Detalhes">
          <FormField
            name="reason"
            label="Motivo"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_ENTRY_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormInput
            name="supplier"
            label="Fornecedor"
            placeholder="Preparado para integração futura"
          />
          <FormInput name="date" label="Data" type="date" />
          <FormField
            name="notes"
            label="Observação"
            render={({ field }) => (
              <Textarea {...field} rows={3} placeholder="Opcional" />
            )}
          />
        </FormSection>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-10 flex-1">
            Registrar entrada
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

        {success && (
          <p className="text-brand-bronze text-sm" role="status">
            Entrada registrada com sucesso.
          </p>
        )}
      </Form>
    </div>
  );
});
