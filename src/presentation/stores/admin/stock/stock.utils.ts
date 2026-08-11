import {
  STOCK_DEFAULT_MIN_QTY,
  STOCK_EXCESS_THRESHOLD,
  STOCK_MOCK_USER,
} from '@shared/constants/stock.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import type {
  InventoryItem,
  StockAlert,
  StockAlertType,
  StockDashboardStats,
  StockFilters,
  StockItem,
  StockItemStatus,
  StockMovement,
  StockMovementType,
  StockSortOption,
} from '@shared/types/stock.types';

export function resolveStockStatus(
  quantity: number,
  minQuantity: number,
): StockItemStatus {
  if (quantity <= 0) return 'out';
  if (quantity <= minQuantity) return 'low';
  if (quantity >= STOCK_EXCESS_THRESHOLD) return 'excess';
  return 'ok';
}

export function buildStockItemsFromProducts(
  products: AdminProduct[],
): StockItem[] {
  const items: StockItem[] = [];

  for (const product of products) {
    if (product.variations.length > 0) {
      for (const v of product.variations) {
        const minQty = v.minStock ?? product.minStock ?? STOCK_DEFAULT_MIN_QTY;
        items.push({
          id: `${product.id}-${v.id}`,
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          sku: v.sku,
          category: product.categoryLabel,
          collection: product.collection,
          team: product.team ?? product.selection,
          brand: product.brand,
          variationId: v.id,
          size: v.size,
          color: v.color,
          quantity: v.stock,
          minQuantity: minQty,
          status: resolveStockStatus(v.stock, minQty),
          cost: product.cost,
          onSale: product.onSale,
          lastUpdated: product.updatedAt,
        });
      }
    } else {
      const minQty = product.minStock ?? STOCK_DEFAULT_MIN_QTY;
      items.push({
        id: `${product.id}-main`,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        sku: product.sku,
        category: product.categoryLabel,
        collection: product.collection,
        team: product.team ?? product.selection,
        brand: product.brand,
        quantity: product.stockQuantity,
        minQuantity: minQty,
        status: resolveStockStatus(product.stockQuantity, minQty),
        cost: product.cost,
        onSale: product.onSale,
        lastUpdated: product.updatedAt,
      });
    }
  }

  return items;
}

export function buildInitialMovements(_items: StockItem[]): StockMovement[] {
  return [];
}

export function buildInitialInventory(items: StockItem[]): InventoryItem[] {
  return items.map((item) => ({
    id: `inv-${item.id}`,
    stockItemId: item.id,
    productName: item.productName,
    sku: item.sku,
    variationLabel:
      [item.size, item.color].filter(Boolean).join(' · ') || undefined,
    systemQuantity: item.quantity,
    status: 'pending' as const,
  }));
}

export function mergeInventoryFromItems(
  items: StockItem[],
  existing: InventoryItem[],
): InventoryItem[] {
  const existingByStockItem = new Map(
    existing.map((entry) => [entry.stockItemId, entry]),
  );

  return items.map((item) => {
    const previous = existingByStockItem.get(item.id);

    if (!previous) {
      return {
        id: `inv-${item.id}`,
        stockItemId: item.id,
        productName: item.productName,
        sku: item.sku,
        variationLabel:
          [item.size, item.color].filter(Boolean).join(' · ') || undefined,
        systemQuantity: item.quantity,
        status: 'pending' as const,
      };
    }

    const countedQuantity = previous.countedQuantity;

    return {
      ...previous,
      productName: item.productName,
      sku: item.sku,
      variationLabel:
        [item.size, item.color].filter(Boolean).join(' · ') || undefined,
      systemQuantity: item.quantity,
      difference:
        countedQuantity !== undefined
          ? countedQuantity - item.quantity
          : previous.difference,
    };
  });
}

const STALE_STOCK_DAYS = 90;

function isStaleStockItem(item: StockItem): boolean {
  const updatedAt = new Date(item.lastUpdated).getTime();
  if (Number.isNaN(updatedAt)) return false;
  const staleThreshold = Date.now() - STALE_STOCK_DAYS * 24 * 60 * 60 * 1000;
  return updatedAt <= staleThreshold;
}

export function getStaleStockItems(items: StockItem[]): StockItem[] {
  return items
    .filter(isStaleStockItem)
    .sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    );
}

export function generateAlerts(items: StockItem[]): StockAlert[] {
  const alerts: StockAlert[] = [];
  const now = new Date().toISOString();

  for (const item of items) {
    if (item.status === 'out') {
      alerts.push({
        id: `alert-out-${item.id}`,
        type: 'out',
        stockItemId: item.id,
        productName: item.productName,
        sku: item.sku,
        message: `${item.productName} sem estoque.`,
        quantity: 0,
        createdAt: now,
      });
    } else if (item.status === 'low') {
      alerts.push({
        id: `alert-low-${item.id}`,
        type: 'low',
        stockItemId: item.id,
        productName: item.productName,
        sku: item.sku,
        message: `${item.productName} abaixo do mínimo (${item.quantity}/${item.minQuantity}).`,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        createdAt: now,
      });
    } else if (item.status === 'excess') {
      alerts.push({
        id: `alert-excess-${item.id}`,
        type: 'excess',
        stockItemId: item.id,
        productName: item.productName,
        sku: item.sku,
        message: `${item.productName} com excesso de estoque.`,
        quantity: item.quantity,
        createdAt: now,
      });
    }
  }

  for (const item of getStaleStockItems(items)) {
    alerts.push({
      id: `alert-stale-${item.id}`,
      type: 'stale',
      stockItemId: item.id,
      productName: item.productName,
      sku: item.sku,
      message: `${item.productName} sem atualização há ${STALE_STOCK_DAYS}+ dias.`,
      quantity: item.quantity,
      createdAt: item.lastUpdated,
    });
  }

  return alerts;
}

export function getDashboardStats(items: StockItem[]): StockDashboardStats {
  return {
    totalQuantity: items.reduce((a, i) => a + i.quantity, 0),
    totalSkus: items.length,
    outOfStock: items.filter((i) => i.status === 'out').length,
    lowStock: items.filter((i) => i.status === 'low').length,
    onPromotion: items.filter((i) => i.onSale).length,
    estimatedValue: items.reduce((a, i) => a + i.quantity * (i.cost ?? 0), 0),
  };
}

export function filterStockItems(
  items: StockItem[],
  filters: StockFilters,
): StockItem[] {
  let result = items;

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (i) =>
        i.productName.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q),
    );
  }
  if (filters.category !== 'all') {
    result = result.filter((i) => i.category === filters.category);
  }
  if (filters.collection !== 'all') {
    result = result.filter((i) => i.collection === filters.collection);
  }
  if (filters.team !== 'all') {
    result = result.filter((i) => i.team === filters.team);
  }
  if (filters.brand !== 'all') {
    result = result.filter((i) => i.brand === filters.brand);
  }
  if (filters.status !== 'all') {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters.lowStock) {
    result = result.filter((i) => i.status === 'low');
  }
  if (filters.outOfStock) {
    result = result.filter((i) => i.status === 'out');
  }
  if (filters.qtyMin !== undefined) {
    result = result.filter((i) => i.quantity >= filters.qtyMin!);
  }
  if (filters.qtyMax !== undefined) {
    result = result.filter((i) => i.quantity <= filters.qtyMax!);
  }

  return result;
}

export function sortStockItems(
  items: StockItem[],
  sort: StockSortOption,
): StockItem[] {
  const sorted = [...items];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    case 'name-desc':
      return sorted.sort((a, b) => b.productName.localeCompare(a.productName));
    case 'qty-asc':
      return sorted.sort((a, b) => a.quantity - b.quantity);
    case 'qty-desc':
      return sorted.sort((a, b) => b.quantity - a.quantity);
    case 'updated-desc':
      return sorted.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    case 'updated-asc':
      return sorted.sort(
        (a, b) =>
          new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      );
    default:
      return sorted;
  }
}

export function createMovement(
  item: StockItem,
  type: StockMovementType,
  quantity: number,
  previousBalance: number,
  currentBalance: number,
  reason: string,
  extra?: Partial<StockMovement>,
): StockMovement {
  return {
    id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    variationId: item.variationId,
    variationLabel:
      [item.size, item.color].filter(Boolean).join(' · ') || undefined,
    quantity,
    previousBalance,
    currentBalance,
    reason,
    user: STOCK_MOCK_USER,
    createdAt: new Date().toISOString(),
    status: 'completed',
    ...extra,
  };
}

export function getUniqueCategories(items: StockItem[]): string[] {
  return [...new Set(items.map((i) => i.category))].sort();
}

export function getMovementChartData(movements: StockMovement[]) {
  const entries = movements.filter((m) => m.type === 'entry').length;
  const exits = movements.filter((m) => m.type === 'exit').length;
  const adjustments = movements.filter((m) => m.type === 'adjustment').length;
  const inventory = movements.filter((m) => m.type === 'inventory').length;

  return [
    { label: 'Entradas', value: entries },
    { label: 'Saídas', value: exits },
    { label: 'Ajustes', value: adjustments + inventory },
  ];
}

export function getTopMovedProducts(movements: StockMovement[]) {
  const counts = new Map<string, { name: string; count: number }>();
  for (const m of movements) {
    const key = m.sku;
    const existing = counts.get(key) ?? { name: m.productName, count: 0 };
    existing.count += m.quantity;
    counts.set(key, existing);
  }
  return [...counts.entries()]
    .map(([, v]) => v)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export type { StockAlertType };
