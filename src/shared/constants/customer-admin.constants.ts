import type {
  AdminCustomerStatus,
  AdminCustomerType,
  AdminCustomerSegment,
  CustomerSortOption,
} from '@shared/types/customer-admin.types';

export const CUSTOMER_STORAGE_KEY = 'underselect-admin-customers';

export const CUSTOMER_PAGE_SIZE = 12;

export const CUSTOMER_NAV_ITEMS = [
  { label: 'Resumo', href: '/admin/clientes' },
  { label: 'Todos os Clientes', href: '/admin/clientes/lista' },
] as const;

export const ADMIN_CUSTOMER_STATUS_LABELS: Record<AdminCustomerStatus, string> =
  {
    active: 'Ativo',
    blocked: 'Bloqueado',
    inactive: 'Inativo',
  };

export const ADMIN_CUSTOMER_TYPE_LABELS: Record<AdminCustomerType, string> = {
  new: 'Novo',
  recurring: 'Recorrente',
  inactive: 'Inativo',
  vip: 'VIP',
};

export const ADMIN_CUSTOMER_SEGMENT_LABELS: Record<
  AdminCustomerSegment,
  string
> = {
  vip: 'VIP',
  recurring: 'Recorrente',
  inactive: 'Inativo',
  new: 'Novo',
  high_ticket: 'Alto ticket',
  coupon_user: 'Usou cupom',
  influencer_origin: 'Influenciador',
};

export const CUSTOMER_SORT_LABELS: Record<CustomerSortOption, string> = {
  'name-asc': 'Nome A–Z',
  'name-desc': 'Nome Z–A',
  'spent-desc': 'Maior valor',
  'spent-asc': 'Menor valor',
  'orders-desc': 'Mais pedidos',
  'registered-desc': 'Cadastro recente',
  'last-purchase-desc': 'Última compra',
};

export const CUSTOMER_STATUS_VARIANT: Record<
  AdminCustomerStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'secondary',
  blocked: 'destructive',
  inactive: 'outline',
};

export const CUSTOMER_TYPE_VARIANT: Record<
  AdminCustomerType,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  new: 'default',
  recurring: 'secondary',
  inactive: 'outline',
  vip: 'default',
};
