'use client';

import { memo, useState } from 'react';

import {
  Form,
  FormField,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { Button, Textarea } from '@presentation/components/ui';
import { useCustomerStore } from '@presentation/stores/admin/customer';
import {
  customerNoteSchema,
  type CustomerNoteSchema,
} from '@presentation/stores/admin/customer/customer.schemas';

export interface CustomerNoteFormProps {
  customerId: string;
}

export const CustomerNoteForm = memo(function CustomerNoteForm({
  customerId,
}: CustomerNoteFormProps) {
  const addInternalNote = useCustomerStore((s) => s.addInternalNote);
  const [success, setSuccess] = useState(false);

  const form = useAppForm<CustomerNoteSchema>(customerNoteSchema, {
    defaultValues: { customerId, note: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    addInternalNote(values);
    form.reset({ customerId, note: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register('customerId')} />
      <FormSection title="Observação interna">
        <FormField
          name="note"
          label="Nota"
          render={({ field }) => (
            <Textarea
              {...field}
              rows={3}
              placeholder="Visível apenas para a equipe (LGPD)"
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
