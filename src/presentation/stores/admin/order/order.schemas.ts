import { z } from 'zod';

const orderStatusEnum = z.enum([
  'new',
  'payment_pending',
  'payment_approved',
  'separation',
  'packaging',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
  'returned',
  'exchange',
]);

export const orderStatusChangeSchema = z.object({
  orderId: z.string().min(1),
  status: orderStatusEnum,
  note: z.string().trim().optional(),
});

export const orderNoteSchema = z.object({
  orderId: z.string().min(1),
  note: z.string().trim().min(1, 'Informe a observação'),
});

export type OrderStatusChangeSchema = z.infer<typeof orderStatusChangeSchema>;
export type OrderNoteSchema = z.infer<typeof orderNoteSchema>;
