import type {
  AdminOrderStatus,
  AdminPaymentMethod,
  AdminPaymentStatus,
  AdminShippingCarrier,
  AdminShippingStatus,
  OrderSortOption,
} from '@shared/types/order-admin.types';

export const ORDER_STORAGE_KEY = 'underselect-admin-orders';

export const ORDER_MOCK_USER = 'Sistema';

export const ORDER_PAGE_SIZE = 12;

export const ORDER_NAV_ITEMS = [
  { label: 'Resumo', href: '/admin/pedidos' },
  { label: 'Todos os Pedidos', href: '/admin/pedidos/lista' },
] as const;

export const ADMIN_ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  new: 'Novo',
  payment_pending: 'Pagamento Pendente',
  payment_approved: 'Pagamento Aprovado',
  separation: 'Separação',
  packaging: 'Embalagem',
  shipped: 'Enviado',
  in_transit: 'Em Transporte',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  returned: 'Devolvido',
  exchange: 'Troca',
};

export const ADMIN_PAYMENT_METHOD_LABELS: Record<AdminPaymentMethod, string> = {
  pix: 'PIX',
  card: 'Cartão de Crédito',
  boleto: 'Boleto',
  infinitepay: 'InfinitePay',
};

export const ADMIN_PAYMENT_STATUS_LABELS: Record<AdminPaymentStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  failed: 'Falhou',
  refunded: 'Estornado',
  chargeback: 'Chargeback',
};

export const ADMIN_SHIPPING_CARRIER_LABELS: Record<
  AdminShippingCarrier,
  string
> = {
  correios: 'Correios',
  melhor_envio: 'Melhor Envio',
  carrier: 'Transportadora',
  pickup: 'Retirada',
};

export const ADMIN_SHIPPING_STATUS_LABELS: Record<AdminShippingStatus, string> =
  {
    pending: 'Pendente',
    label_generated: 'Etiqueta Gerada',
    shipped: 'Despachado',
    in_transit: 'Em Transporte',
    delivered: 'Entregue',
  };

export const ORDER_SORT_LABELS: Record<OrderSortOption, string> = {
  'date-desc': 'Mais recentes',
  'date-asc': 'Mais antigos',
  'value-desc': 'Maior valor',
  'value-asc': 'Menor valor',
  'number-desc': 'Número decrescente',
  'number-asc': 'Número crescente',
  'customer-asc': 'Cliente A–Z',
};

export const ORDER_STATUS_FLOW: AdminOrderStatus[] = [
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
];

export const ORDER_STATUS_VARIANT: Record<
  AdminOrderStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  new: 'default',
  payment_pending: 'outline',
  payment_approved: 'secondary',
  separation: 'secondary',
  packaging: 'secondary',
  shipped: 'secondary',
  in_transit: 'secondary',
  delivered: 'secondary',
  cancelled: 'destructive',
  returned: 'destructive',
  exchange: 'outline',
};
