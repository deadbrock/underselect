'use client';

import { memo, useState } from 'react';

import {
  Form,
  FormField,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { Button, Textarea } from '@presentation/components/ui';
import { useOrderStore } from '@presentation/stores/admin/order';
import {
  orderNoteSchema,
  type OrderNoteSchema,
} from '@presentation/stores/admin/order/order.schemas';

export interface OrderNoteFormProps {
  orderId: string;
}

export const OrderNoteForm = memo(function OrderNoteForm({
  orderId,
}: OrderNoteFormProps) {
  const addInternalNote = useOrderStore((s) => s.addInternalNote);
  const [success, setSuccess] = useState(false);

  const form = useAppForm<OrderNoteSchema>(orderNoteSchema, {
    defaultValues: { orderId, note: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    addInternalNote(values);
    form.reset({ orderId, note: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register('orderId')} />
      <FormSection title="Observação interna">
        <FormField
          name="note"
          label="Nota"
          render={({ field }) => (
            <Textarea
              {...field}
              rows={3}
              placeholder="Visível apenas para a equipe"
            />
          )}
        />
      </FormSection>
      <Button type="submit" variant="outline" className="min-h-10 w-full">
        Adicionar observação
      </Button>
      {success && (
        <p className="text-brand-bronze text-sm" role="status">
          Observação registrada.
        </p>
      )}
    </Form>
  );
});
