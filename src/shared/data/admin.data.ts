import type {
  AdminActivity,
  AdminChartPoint,
  AdminListRow,
  AdminModuleId,
  AdminNotification,
  AdminProfile,
  AdminSearchResult,
  AdminStats,
} from '@shared/types/admin.types';

export const MOCK_ADMIN_PROFILE: AdminProfile = {
  id: '',
  name: 'Administrador',
  email: '',
  role: 'Administrador',
  avatarInitials: 'AD',
};

export const MOCK_ADMIN_STATS: AdminStats = {
  revenue: 0,
  revenueTrend: 0,
  orders: 0,
  ordersTrend: 0,
  customers: 0,
  customersTrend: 0,
  products: 0,
  productsTrend: 0,
  lowStock: 0,
  couponsUsed: 0,
  conversionRate: 0,
  averageTicket: 0,
};

export const MOCK_REVENUE_CHART: AdminChartPoint[] = [];
export const MOCK_ORDERS_CHART: AdminChartPoint[] = [];
export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [];
export const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [];

const ADMIN_MODULE_DATA: Record<AdminModuleId, AdminListRow[]> = {
  produtos: [],
  categorias: [],
  colecoes: [],
  'times-selecoes': [],
  pedidos: [],
  clientes: [],
  estoque: [],
  cupons: [],
  influenciadores: [],
  campanhas: [],
  banners: [],
  relatorios: [],
  configuracoes: [],
  perfil: [],
};

export function getAdminModuleData(moduleId: AdminModuleId): AdminListRow[] {
  return ADMIN_MODULE_DATA[moduleId] ?? [];
}

export function searchAdmin(_query: string): AdminSearchResult[] {
  return [];
}

export function getAdminRecentOrders(): AdminListRow[] {
  return [];
}
