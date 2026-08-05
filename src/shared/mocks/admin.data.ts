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
import { CATALOG_CATEGORIES } from '@shared/mocks/catalog.constants';
import { CATALOG_PRODUCTS } from '@shared/mocks/catalog.utils';
import { MOCK_ACCOUNT_ORDERS } from '@shared/mocks/account.data';
import { formatCurrency } from '@shared/utils/format';

export const MOCK_ADMIN_PROFILE: AdminProfile = {
  id: 'admin-1',
  name: 'Rafael Souza',
  email: 'admin@underselect.com.br',
  role: 'Administrador',
  avatarInitials: 'RS',
};

export const MOCK_ADMIN_STATS: AdminStats = {
  revenue: 487320.5,
  revenueTrend: 12.4,
  orders: 1248,
  ordersTrend: 8.2,
  customers: 3842,
  customersTrend: 5.6,
  products: CATALOG_PRODUCTS.length,
  productsTrend: 2.1,
  lowStock: 7,
  couponsUsed: 342,
  conversionRate: 3.8,
  averageTicket: 389.9,
};

export const MOCK_REVENUE_CHART: AdminChartPoint[] = [
  { label: 'Jan', value: 32000 },
  { label: 'Fev', value: 38500 },
  { label: 'Mar', value: 41200 },
  { label: 'Abr', value: 39800 },
  { label: 'Mai', value: 45600 },
  { label: 'Jun', value: 52100 },
  { label: 'Jul', value: 48900 },
  { label: 'Ago', value: 55300 },
];

export const MOCK_ORDERS_CHART: AdminChartPoint[] = [
  { label: 'Seg', value: 42 },
  { label: 'Ter', value: 38 },
  { label: 'Qua', value: 55 },
  { label: 'Qui', value: 48 },
  { label: 'Sex', value: 72 },
  { label: 'Sáb', value: 89 },
  { label: 'Dom', value: 64 },
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'n1',
    title: 'Novo pedido',
    message: 'Pedido US-MOCK003 aguardando processamento.',
    read: false,
    createdAt: '2026-08-15T18:45:00.000Z',
    type: 'order',
  },
  {
    id: 'n2',
    title: 'Estoque baixo',
    message: '3 produtos abaixo do mínimo de estoque.',
    read: false,
    createdAt: '2026-08-15T10:00:00.000Z',
    type: 'stock',
  },
  {
    id: 'n3',
    title: 'Campanha encerrando',
    message: 'Promoção Verão 2026 termina em 3 dias.',
    read: true,
    createdAt: '2026-08-14T09:00:00.000Z',
    type: 'campaign',
  },
  {
    id: 'n4',
    title: 'Backup concluído',
    message: 'Backup automático realizado com sucesso.',
    read: true,
    createdAt: '2026-08-13T03:00:00.000Z',
    type: 'system',
  },
];

export const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: 'a1',
    action: 'Pedido atualizado',
    description: 'US-MOCK002 marcado como enviado.',
    createdAt: '2026-08-15T16:30:00.000Z',
    user: 'Rafael Souza',
  },
  {
    id: 'a2',
    action: 'Produto editado',
    description: 'Camisa Flamengo 2024/25 — preço atualizado.',
    createdAt: '2026-08-15T14:00:00.000Z',
    user: 'Rafael Souza',
  },
  {
    id: 'a3',
    action: 'Cupom criado',
    description: 'Cupom UNDER10 — 10% de desconto.',
    createdAt: '2026-08-14T11:20:00.000Z',
    user: 'Rafael Souza',
  },
  {
    id: 'a4',
    action: 'Banner publicado',
    description: 'Banner Hero Verão 2026 ativado na home.',
    createdAt: '2026-08-13T09:45:00.000Z',
    user: 'Rafael Souza',
  },
  {
    id: 'a5',
    action: 'Cliente cadastrado',
    description: 'Novo cliente: Ana Costa.',
    createdAt: '2026-08-12T17:10:00.000Z',
    user: 'Sistema',
  },
];

const MOCK_PRODUCTS: AdminListRow[] = CATALOG_PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  status: p.inStock ? 'active' : 'inactive',
  subtitle: p.categoryLabel,
  meta: p.team ?? p.typeLabel,
  value: formatCurrency(p.price),
  badge: p.onSale ? 'Promoção' : p.isNew ? 'Novo' : undefined,
  createdAt: p.createdAt,
}));

const MOCK_CATEGORIES: AdminListRow[] = CATALOG_CATEGORIES.map((c) => ({
  id: c.slug,
  name: c.label,
  status: 'active',
  subtitle: c.description,
  createdAt: '2025-01-01',
}));

const MOCK_COLLECTIONS: AdminListRow[] = [
  {
    id: 'col-1',
    name: 'Verão 2026',
    status: 'active',
    subtitle: 'Coleção sazonal',
    meta: '24 produtos',
    createdAt: '2026-01-01',
  },
  {
    id: 'col-2',
    name: 'Brasileirão 2026',
    status: 'active',
    subtitle: 'Clubes nacionais',
    meta: '18 produtos',
    createdAt: '2026-02-15',
  },
  {
    id: 'col-3',
    name: 'Seleções Copa',
    status: 'draft',
    subtitle: 'Seleções mundial',
    meta: '12 produtos',
    createdAt: '2026-03-01',
  },
  {
    id: 'col-4',
    name: 'Premium Match',
    status: 'active',
    subtitle: 'Linha premium',
    meta: '8 produtos',
    createdAt: '2025-11-01',
  },
];

const MOCK_TEAMS: AdminListRow[] = [
  {
    id: 't1',
    name: 'Flamengo',
    status: 'active',
    subtitle: 'Clubes Brasileiros',
    meta: '6 produtos',
  },
  {
    id: 't2',
    name: 'Corinthians',
    status: 'active',
    subtitle: 'Clubes Brasileiros',
    meta: '5 produtos',
  },
  {
    id: 't3',
    name: 'Palmeiras',
    status: 'active',
    subtitle: 'Clubes Brasileiros',
    meta: '4 produtos',
  },
  {
    id: 't4',
    name: 'Brasil',
    status: 'active',
    subtitle: 'Seleções',
    meta: '3 produtos',
  },
  {
    id: 't5',
    name: 'Real Madrid',
    status: 'active',
    subtitle: 'Clubes Europeus',
    meta: '4 produtos',
  },
];

const MOCK_ORDERS: AdminListRow[] = MOCK_ACCOUNT_ORDERS.map((o) => ({
  id: o.id,
  name: o.number,
  status: o.status,
  subtitle: `${o.itemCount} itens`,
  value: formatCurrency(o.total),
  createdAt: o.createdAt,
}));

const MOCK_CUSTOMERS: AdminListRow[] = [
  {
    id: 'c1',
    name: 'Rafael Souza',
    status: 'active',
    subtitle: 'rafael.souza@email.com',
    meta: '3 pedidos',
    value: formatCurrency(1868.7),
    createdAt: '2026-01-10',
  },
  {
    id: 'c2',
    name: 'Ana Costa',
    status: 'active',
    subtitle: 'ana.costa@email.com',
    meta: '1 pedido',
    value: formatCurrency(449),
    createdAt: '2026-08-12',
  },
  {
    id: 'c3',
    name: 'Lucas Mendes',
    status: 'active',
    subtitle: 'lucas.m@email.com',
    meta: '5 pedidos',
    value: formatCurrency(2340),
    createdAt: '2025-12-05',
  },
  {
    id: 'c4',
    name: 'Mariana Lima',
    status: 'inactive',
    subtitle: 'mari.lima@email.com',
    meta: '0 pedidos',
    createdAt: '2026-06-20',
  },
];

const MOCK_STOCK: AdminListRow[] = CATALOG_PRODUCTS.slice(0, 12).map(
  (p, i) => ({
    id: p.id,
    name: p.name,
    status: i < 3 ? 'inactive' : 'active',
    subtitle: p.categoryLabel,
    meta: i < 3 ? 'Estoque baixo' : 'Normal',
    value: `${Math.max(0, 50 - i * 7)} un.`,
    badge: i < 3 ? 'Alerta' : undefined,
  }),
);

const MOCK_COUPONS: AdminListRow[] = [
  {
    id: 'cp1',
    name: 'UNDER10',
    status: 'active',
    subtitle: '10% de desconto',
    meta: '342 usos',
    createdAt: '2026-01-01',
  },
  {
    id: 'cp2',
    name: 'FRETEGRATIS',
    status: 'active',
    subtitle: 'Frete grátis',
    meta: '128 usos',
    createdAt: '2026-03-01',
  },
  {
    id: 'cp3',
    name: 'BEMVINDO',
    status: 'archived',
    subtitle: '15% primeira compra',
    meta: '890 usos',
    createdAt: '2025-06-01',
  },
  {
    id: 'cp4',
    name: 'VERAO26',
    status: 'draft',
    subtitle: '20% coleção verão',
    meta: '0 usos',
    createdAt: '2026-08-01',
  },
];

const MOCK_INFLUENCERS: AdminListRow[] = [
  {
    id: 'inf1',
    name: '@camisasfutebol',
    status: 'active',
    subtitle: 'Instagram · 245k',
    meta: 'Comissão 8%',
    value: formatCurrency(12400),
  },
  {
    id: 'inf2',
    name: '@undergroundfc',
    status: 'active',
    subtitle: 'TikTok · 180k',
    meta: 'Comissão 10%',
    value: formatCurrency(8900),
  },
  {
    id: 'inf3',
    name: '@selecao.br',
    status: 'draft',
    subtitle: 'YouTube · 92k',
    meta: 'Comissão 7%',
    createdAt: '2026-07-01',
  },
];

const MOCK_CAMPAIGNS: AdminListRow[] = [
  {
    id: 'camp1',
    name: 'Verão 2026',
    status: 'active',
    subtitle: 'Promoção sazonal',
    meta: 'CTR 4.2%',
    createdAt: '2026-06-01',
  },
  {
    id: 'camp2',
    name: 'Brasileirão',
    status: 'active',
    subtitle: 'Clubes nacionais',
    meta: 'CTR 3.8%',
    createdAt: '2026-04-15',
  },
  {
    id: 'camp3',
    name: 'Black Friday',
    status: 'draft',
    subtitle: 'Mega promoção',
    meta: 'Agendada',
    createdAt: '2026-11-01',
  },
];

const MOCK_BANNERS: AdminListRow[] = [
  {
    id: 'ban1',
    name: 'Hero Verão 2026',
    status: 'active',
    subtitle: 'Home — principal',
    meta: 'Desktop + Mobile',
    createdAt: '2026-06-01',
  },
  {
    id: 'ban2',
    name: 'Promo Brasileirão',
    status: 'active',
    subtitle: 'Home — secundário',
    meta: 'Desktop',
    createdAt: '2026-04-01',
  },
  {
    id: 'ban3',
    name: 'Newsletter CTA',
    status: 'active',
    subtitle: 'Footer',
    meta: 'Todos dispositivos',
    createdAt: '2025-12-01',
  },
  {
    id: 'ban4',
    name: 'Coleção Premium',
    status: 'draft',
    subtitle: 'Categoria',
    meta: 'Rascunho',
    createdAt: '2026-08-01',
  },
];

const MOCK_REPORTS: AdminListRow[] = [
  {
    id: 'rep1',
    name: 'Vendas por período',
    status: 'active',
    subtitle: 'Relatório financeiro',
    meta: 'Atualizado hoje',
  },
  {
    id: 'rep2',
    name: 'Produtos mais vendidos',
    status: 'active',
    subtitle: 'Ranking de produtos',
    meta: 'Atualizado hoje',
  },
  {
    id: 'rep3',
    name: 'Conversão por canal',
    status: 'active',
    subtitle: 'Marketing',
    meta: 'Semanal',
  },
  {
    id: 'rep4',
    name: 'Estoque e reposição',
    status: 'active',
    subtitle: 'Operacional',
    meta: 'Diário',
  },
];

const MOCK_SETTINGS: AdminListRow[] = [
  {
    id: 'set1',
    name: 'Informações da loja',
    status: 'active',
    subtitle: 'Nome, CNPJ, contato',
  },
  {
    id: 'set2',
    name: 'Pagamentos',
    status: 'active',
    subtitle: 'InfinitePay, PIX, boleto',
  },
  {
    id: 'set3',
    name: 'Frete e entrega',
    status: 'active',
    subtitle: 'Correios, transportadoras',
  },
  {
    id: 'set4',
    name: 'Notificações',
    status: 'active',
    subtitle: 'E-mail e push',
  },
];

const MOCK_PROFILE: AdminListRow[] = [
  {
    id: 'prof1',
    name: 'Dados pessoais',
    status: 'active',
    subtitle: MOCK_ADMIN_PROFILE.name,
    meta: MOCK_ADMIN_PROFILE.email,
  },
  {
    id: 'prof2',
    name: 'Alterar senha',
    status: 'active',
    subtitle: 'Segurança da conta',
  },
  {
    id: 'prof3',
    name: 'Preferências',
    status: 'active',
    subtitle: 'Tema e idioma',
  },
];

const MODULE_DATA: Record<AdminModuleId, AdminListRow[]> = {
  produtos: MOCK_PRODUCTS,
  categorias: MOCK_CATEGORIES,
  colecoes: MOCK_COLLECTIONS,
  'times-selecoes': MOCK_TEAMS,
  pedidos: MOCK_ORDERS,
  clientes: MOCK_CUSTOMERS,
  estoque: MOCK_STOCK,
  cupons: MOCK_COUPONS,
  influenciadores: MOCK_INFLUENCERS,
  campanhas: MOCK_CAMPAIGNS,
  banners: MOCK_BANNERS,
  relatorios: MOCK_REPORTS,
  configuracoes: MOCK_SETTINGS,
  perfil: MOCK_PROFILE,
};

export function getAdminModuleData(moduleId: AdminModuleId): AdminListRow[] {
  return MODULE_DATA[moduleId] ?? [];
}

export function getAdminRecentOrders(): AdminListRow[] {
  return MOCK_ORDERS;
}

export const MOCK_GLOBAL_SEARCH: AdminSearchResult[] = [
  ...MOCK_PRODUCTS.slice(0, 3).map((p) => ({
    id: p.id,
    label: p.name,
    href: '/admin/produtos',
    category: 'Produtos',
  })),
  ...MOCK_ORDERS.map((o) => ({
    id: o.id,
    label: o.name,
    href: '/admin/pedidos',
    category: 'Pedidos',
  })),
  ...MOCK_CUSTOMERS.slice(0, 2).map((c) => ({
    id: c.id,
    label: c.name,
    href: '/admin/clientes',
    category: 'Clientes',
  })),
];

export function searchAdmin(query: string): AdminSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_GLOBAL_SEARCH.filter(
    (r) =>
      r.label.toLowerCase().includes(q) || r.category.toLowerCase().includes(q),
  );
}
