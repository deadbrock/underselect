import type {
  StockAlertType,
  StockItemStatus,
  StockMovementType,
  StockSortOption,
} from '@shared/types/stock.types';

export const STOCK_STORAGE_KEY = 'underselect-admin-stock';

export const STOCK_MOCK_USER = 'Rafael Souza';

export const STOCK_DEFAULT_MIN_QTY = 5;

export const STOCK_EXCESS_THRESHOLD = 100;

export const STOCK_PAGE_SIZE = 12;

export const STOCK_NAV_ITEMS = [
  { label: 'Resumo', href: '/admin/estoque' },
  { label: 'Produtos', href: '/admin/estoque/produtos' },
  { label: 'Movimentações', href: '/admin/estoque/movimentacoes' },
  { label: 'Entradas', href: '/admin/estoque/entradas' },
  { label: 'Saídas', href: '/admin/estoque/saidas' },
  { label: 'Ajustes', href: '/admin/estoque/ajustes' },
  { label: 'Transferências', href: '/admin/estoque/transferencias' },
  { label: 'Inventário', href: '/admin/estoque/inventario' },
  { label: 'Alertas', href: '/admin/estoque/alertas' },
  { label: 'Relatórios', href: '/admin/estoque/relatorios' },
] as const;

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  entry: 'Entrada',
  exit: 'Saída',
  adjustment: 'Ajuste',
  transfer: 'Transferência',
  inventory: 'Inventário',
};

export const STOCK_ITEM_STATUS_LABELS: Record<StockItemStatus, string> = {
  ok: 'Normal',
  low: 'Estoque baixo',
  out: 'Sem estoque',
  excess: 'Excesso',
};

export const STOCK_ALERT_LABELS: Record<StockAlertType, string> = {
  low: 'Estoque baixo',
  out: 'Sem estoque',
  stale: 'Produto parado',
  excess: 'Excesso de estoque',
};

export const STOCK_SORT_LABELS: Record<StockSortOption, string> = {
  'name-asc': 'Nome A–Z',
  'name-desc': 'Nome Z–A',
  'qty-asc': 'Menor quantidade',
  'qty-desc': 'Maior quantidade',
  'updated-desc': 'Atualização recente',
  'updated-asc': 'Atualização antiga',
};

export const STOCK_ENTRY_REASONS = [
  'Compra fornecedor',
  'Devolução cliente',
  'Reposição',
  'Produção',
  'Outro',
] as const;

export const STOCK_EXIT_REASONS = [
  'Venda',
  'Perda',
  'Avaria',
  'Amostra',
  'Doação',
  'Outro',
] as const;

export const STOCK_ADJUSTMENT_REASONS = [
  'Correção inventário',
  'Contagem física',
  'Erro de lançamento',
  'Outro',
] as const;
