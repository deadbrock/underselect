import type { AdminModuleId } from '@shared/types/admin.types';

export const ADMIN_STORAGE_KEY = 'underselect-admin';
export const ADMIN_BASE_PATH = '/admin';

export const ADMIN_ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  processing: 'Em processamento',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const ADMIN_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  draft: 'Rascunho',
  archived: 'Arquivado',
};

export interface AdminNavChild {
  label: string;
  href: string;
  moduleId: AdminModuleId;
}

export interface AdminNavGroup {
  label: string;
  moduleId?: AdminModuleId;
  href?: string;
  children?: AdminNavChild[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    moduleId: undefined as unknown as AdminModuleId,
  },
  {
    label: 'Catálogo',
    children: [
      { label: 'Produtos', href: '/admin/produtos', moduleId: 'produtos' },
      {
        label: 'Categorias',
        href: '/admin/categorias',
        moduleId: 'categorias',
      },
      { label: 'Coleções', href: '/admin/colecoes', moduleId: 'colecoes' },
      {
        label: 'Times e Seleções',
        href: '/admin/times-selecoes',
        moduleId: 'times-selecoes',
      },
    ],
  },
  {
    label: 'Vendas',
    children: [
      { label: 'Pedidos', href: '/admin/pedidos', moduleId: 'pedidos' },
      { label: 'Clientes', href: '/admin/clientes', moduleId: 'clientes' },
      { label: 'Cupons', href: '/admin/cupons', moduleId: 'cupons' },
    ],
  },
  {
    label: 'Operações',
    children: [
      { label: 'Estoque', href: '/admin/estoque', moduleId: 'estoque' },
      {
        label: 'Relatórios',
        href: '/admin/relatorios',
        moduleId: 'relatorios',
      },
    ],
  },
  {
    label: 'Marketing',
    children: [
      {
        label: 'Influenciadores',
        href: '/admin/influenciadores',
        moduleId: 'influenciadores',
      },
      {
        label: 'Campanhas',
        href: '/admin/campanhas',
        moduleId: 'campanhas',
      },
      { label: 'Banners', href: '/admin/banners', moduleId: 'banners' },
    ],
  },
  {
    label: 'Sistema',
    children: [
      {
        label: 'Configurações',
        href: '/admin/configuracoes',
        moduleId: 'configuracoes',
      },
      { label: 'Perfil', href: '/admin/perfil', moduleId: 'perfil' },
    ],
  },
];

export const ADMIN_BOTTOM_NAV = [
  { label: 'Início', href: '/admin/dashboard' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Produtos', href: '/admin/produtos' },
  { label: 'Mais', href: '/admin/configuracoes' },
] as const;

export interface AdminModuleMeta {
  id: AdminModuleId;
  title: string;
  description: string;
  path: `/${string}`;
  singularLabel: string;
}

export const ADMIN_MODULE_META: Record<AdminModuleId, AdminModuleMeta> = {
  produtos: {
    id: 'produtos',
    title: 'Produtos',
    description: 'Gerencie o catálogo de produtos da loja.',
    path: '/admin/produtos',
    singularLabel: 'produto',
  },
  categorias: {
    id: 'categorias',
    title: 'Categorias',
    description: 'Organize categorias e subcategorias.',
    path: '/admin/categorias',
    singularLabel: 'categoria',
  },
  colecoes: {
    id: 'colecoes',
    title: 'Coleções',
    description: 'Crie e gerencie coleções sazonais.',
    path: '/admin/colecoes',
    singularLabel: 'coleção',
  },
  'times-selecoes': {
    id: 'times-selecoes',
    title: 'Times e Seleções',
    description: 'Gerencie times, seleções e parcerias.',
    path: '/admin/times-selecoes',
    singularLabel: 'time',
  },
  pedidos: {
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Acompanhe e gerencie todos os pedidos.',
    path: '/admin/pedidos',
    singularLabel: 'pedido',
  },
  clientes: {
    id: 'clientes',
    title: 'Clientes',
    description: 'Visualize e gerencie a base de clientes.',
    path: '/admin/clientes',
    singularLabel: 'cliente',
  },
  estoque: {
    id: 'estoque',
    title: 'Estoque',
    description: 'Controle níveis de estoque e alertas.',
    path: '/admin/estoque',
    singularLabel: 'item',
  },
  cupons: {
    id: 'cupons',
    title: 'Cupons',
    description: 'Crie e gerencie cupons de desconto.',
    path: '/admin/cupons',
    singularLabel: 'cupom',
  },
  influenciadores: {
    id: 'influenciadores',
    title: 'Influenciadores',
    description: 'Gerencie parcerias e comissões.',
    path: '/admin/influenciadores',
    singularLabel: 'influenciador',
  },
  campanhas: {
    id: 'campanhas',
    title: 'Campanhas',
    description: 'Campanhas de marketing e promoções.',
    path: '/admin/campanhas',
    singularLabel: 'campanha',
  },
  banners: {
    id: 'banners',
    title: 'Banners',
    description: 'Banners da home e páginas promocionais.',
    path: '/admin/banners',
    singularLabel: 'banner',
  },
  relatorios: {
    id: 'relatorios',
    title: 'Relatórios',
    description: 'Relatórios e análises de desempenho.',
    path: '/admin/relatorios',
    singularLabel: 'relatório',
  },
  configuracoes: {
    id: 'configuracoes',
    title: 'Configurações',
    description: 'Configurações gerais do painel e loja.',
    path: '/admin/configuracoes',
    singularLabel: 'configuração',
  },
  perfil: {
    id: 'perfil',
    title: 'Perfil',
    description: 'Seu perfil administrativo.',
    path: '/admin/perfil',
    singularLabel: 'perfil',
  },
};
