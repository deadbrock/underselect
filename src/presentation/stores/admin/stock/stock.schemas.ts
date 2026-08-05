import { z } from 'zod';

export const stockEntrySchema = z.object({
  stockItemId: z.string().min(1, 'Selecione o produto'),
  quantity: z.coerce.number().int().positive('Quantidade inválida'),
  reason: z.string().trim().min(1, 'Informe o motivo'),
  notes: z.string().trim().optional(),
  supplier: z.string().trim().optional(),
  date: z.string().optional(),
});

export const stockExitSchema = z.object({
  stockItemId: z.string().min(1, 'Selecione o produto'),
  quantity: z.coerce.number().int().positive('Quantidade inválida'),
  reason: z.string().trim().min(1, 'Informe o motivo'),
  notes: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  date: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  stockItemId: z.string().min(1, 'Selecione o produto'),
  mode: z.enum(['add', 'remove', 'set']),
  quantity: z.coerce.number().int().min(0, 'Quantidade inválida'),
  reason: z.string().trim().min(1, 'Informe o motivo'),
  notes: z.string().trim().optional(),
});

export const inventoryCountSchema = z.object({
  countedQuantity: z.coerce.number().int().min(0, 'Quantidade inválida'),
  notes: z.string().trim().optional(),
});

export type StockEntrySchema = z.infer<typeof stockEntrySchema>;
export type StockExitSchema = z.infer<typeof stockExitSchema>;
export type StockAdjustmentSchema = z.infer<typeof stockAdjustmentSchema>;
export type InventoryCountSchema = z.infer<typeof inventoryCountSchema>;
