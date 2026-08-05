'use client';

import { memo, useState } from 'react';

import {
  Form,
  FormField,
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
import { useOrderStore } from '@presentation/stores/admin/order';
import {
  orderStatusChangeSchema,
  type OrderStatusChangeSchema,
} from '@presentation/stores/admin/order/order.schemas';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
} from '@shared/constants/order-admin.constants';
import type { AdminOrderStatus } from '@shared/types/order-admin.types';

export interface OrderStatusFormProps {
  orderId: string;
  currentStatus: AdminOrderStatus;
  onSuccess?: () => void;
}

export const OrderStatusForm = memo(function OrderStatusForm({
  orderId,
  currentStatus,
  onSuccess,
}: OrderStatusFormProps) {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const [success, setSuccess] = useState(false);

  const form = useAppForm<OrderStatusChangeSchema>(orderStatusChangeSchema, {
    defaultValues: {
      orderId,
      status: currentStatus,
      note: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateOrderStatus(values);
    setSuccess(true);
    onSuccess?.();
    setTimeout(() => setSuccess(false), 2500);
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register('orderId')} />
      <FormSection title="Alterar status">
        <FormField
          name="status"
          label="Novo status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_FLOW.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ADMIN_ORDER_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormField
          name="note"
          label="Observação"
          render={({ field }) => (
            <Textarea {...field} rows={2} placeholder="Opcional" />
          )}
        />
      </FormSection>
      <Button type="submit" className="min-h-10 w-full">
        Atualizar status
      </Button>
      {success && (
        <p className="text-brand-bronze text-sm" role="status">
          Status atualizado com sucesso.
        </p>
      )}
    </Form>
  );
});
