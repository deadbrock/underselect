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
  stockExitSchema,
  type StockExitSchema,
} from '@presentation/stores/admin/stock/stock.schemas';
import { STOCK_EXIT_REASONS } from '@shared/constants/stock.constants';

import { stockItemSelectField } from './stock-item-select';

export const StockExitForm = memo(function StockExitForm() {
  const router = useRouter();
  const stockItems = useStockStore((s) => s.stockItems);
  const registerExit = useStockStore((s) => s.registerExit);
  const [success, setSuccess] = useState(false);

  const form = useAppForm<StockExitSchema>(stockExitSchema, {
    defaultValues: {
      stockItemId: '',
      quantity: 1,
      reason: STOCK_EXIT_REASONS[0],
      notes: '',
      destination: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    registerExit(values);
    setSuccess(true);
    form.reset({
      stockItemId: '',
      quantity: 1,
      reason: STOCK_EXIT_REASONS[0],
      notes: '',
      destination: '',
    });
    setTimeout(() => setSuccess(false), 3000);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saída de Estoque"
        description="Registre vendas, perdas ou transferências — baixa automática no saldo."
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
                  {STOCK_EXIT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormInput
            name="destination"
            label="Destino"
            placeholder="Preparado para integração futura"
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
          <Button type="submit" className="min-h-10 flex-1">
            Registrar saída
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
            Saída registrada com sucesso.
          </p>
        )}
      </Form>
    </div>
  );
});
