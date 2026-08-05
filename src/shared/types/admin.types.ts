export type AdminModuleId =
  | 'produtos'
  | 'categorias'
  | 'colecoes'
  | 'times-selecoes'
  | 'pedidos'
  | 'clientes'
  | 'estoque'
  | 'cupons'
  | 'influenciadores'
  | 'campanhas'
  | 'banners'
  | 'relatorios'
  | 'configuracoes'
  | 'perfil';

export type AdminStatus = 'active' | 'inactive' | 'draft' | 'archived';

export type AdminOrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminStats {
  revenue: number;
  revenueTrend: number;
  orders: number;
  ordersTrend: number;
  customers: number;
  customersTrend: number;
  products: number;
  productsTrend: number;
  lowStock: number;
  couponsUsed: number;
  conversionRate: number;
  averageTicket: number;
}

export interface AdminChartPoint {
  label: string;
  value: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'order' | 'stock' | 'system' | 'campaign';
}

export interface AdminActivity {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  user: string;
}

export interface AdminListRow {
  id: string;
  name: string;
  status: AdminStatus | AdminOrderStatus | string;
  subtitle?: string;
  meta?: string;
  value?: string | number;
  badge?: string;
  createdAt?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

export interface AdminSearchResult {
  id: string;
  label: string;
  href: string;
  category: string;
}
