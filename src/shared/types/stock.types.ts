export type StockMovementType = 'entry' | 'exit' | 'adjustment' | 'inventory';

export type StockMovementStatus = 'completed' | 'pending' | 'cancelled';

export type StockItemStatus = 'ok' | 'low' | 'out' | 'excess';

export type StockAlertType = 'low' | 'out' | 'stale' | 'excess';

export type InventoryItemStatus = 'pending' | 'counted' | 'adjusted';

export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  sku: string;
  category: string;
  collection: string;
  team?: string;
  brand: string;
  variationId?: string;
  size?: string;
  color?: string;
  quantity: number;
  minQuantity: number;
  status: StockItemStatus;
  cost?: number;
  onSale: boolean;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  type: StockMovementType;
  productId: string;
  productName: string;
  sku: string;
  variationId?: string;
  variationLabel?: string;
  quantity: number;
  previousBalance: number;
  currentBalance: number;
  reason: string;
  notes?: string;
  user: string;
  createdAt: string;
  status: StockMovementStatus;
  supplier?: string;
  destination?: string;
}

export interface StockAlert {
  id: string;
  type: StockAlertType;
  stockItemId: string;
  productName: string;
  sku: string;
  message: string;
  quantity: number;
  minQuantity?: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  stockItemId: string;
  productName: string;
  sku: string;
  variationLabel?: string;
  systemQuantity: number;
  countedQuantity?: number;
  difference?: number;
  status: InventoryItemStatus;
  notes?: string;
}

export interface StockDashboardStats {
  totalQuantity: number;
  totalSkus: number;
  outOfStock: number;
  lowStock: number;
  onPromotion: number;
  estimatedValue: number;
}

export interface StockFilters {
  search: string;
  category: string;
  collection: string;
  team: string;
  brand: string;
  status: string;
  lowStock: boolean;
  outOfStock: boolean;
  qtyMin?: number;
  qtyMax?: number;
}

export interface StockEntryInput {
  stockItemId: string;
  quantity: number;
  reason: string;
  notes?: string;
  supplier?: string;
  date?: string;
}

export interface StockExitInput {
  stockItemId: string;
  quantity: number;
  reason: string;
  notes?: string;
  destination?: string;
  date?: string;
}

export interface StockAdjustmentInput {
  stockItemId: string;
  mode: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}

export type StockSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'qty-asc'
  | 'qty-desc'
  | 'updated-desc'
  | 'updated-asc';
