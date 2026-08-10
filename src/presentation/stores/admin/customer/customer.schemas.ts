import { z } from 'zod';

export const customerNoteSchema = z.object({
  customerId: z.string().min(1),
  note: z.string().trim().min(1, 'Informe a observação'),
});

export type CustomerNoteSchema = z.infer<typeof customerNoteSchema>;
