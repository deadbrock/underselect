import type {
  AdminCampaignStatus,
  AdminCouponDiscountType,
  AdminCouponStatus,
  AdminInfluencerStatus,
  CampaignSortOption,
  CouponSortOption,
  InfluencerChannel,
  InfluencerSortOption,
} from '@shared/types/marketing-admin.types';

export const MARKETING_STORAGE_KEY = 'underselect-admin-marketing';

export const MARKETING_PAGE_SIZE = 12;

export const MARKETING_NAV_ITEMS = [
  { label: 'Resumo', href: '/admin/marketing' },
  { label: 'Influenciadores', href: '/admin/marketing/influenciadores' },
  { label: 'Campanhas', href: '/admin/marketing/campanhas' },
  { label: 'Cupons', href: '/admin/marketing/cupons' },
  {
    label: 'Rel. Cupons',
    href: '/admin/marketing/relatorios/cupons',
  },
  {
    label: 'Rel. Influenciadores',
    href: '/admin/marketing/relatorios/influenciadores',
  },
] as const;

export const ADMIN_INFLUENCER_STATUS_LABELS: Record<
  AdminInfluencerStatus,
  string
> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const ADMIN_CAMPAIGN_STATUS_LABELS: Record<AdminCampaignStatus, string> =
  {
    planned: 'Planejada',
    active: 'Ativa',
    finished: 'Finalizada',
    paused: 'Pausada',
  };

export const ADMIN_COUPON_STATUS_LABELS: Record<AdminCouponStatus, string> = {
  active: 'Ativo',
  scheduled: 'Agendado',
  expired: 'Expirado',
  paused: 'Pausado',
  depleted: 'Esgotado',
};

export const ADMIN_COUPON_TYPE_LABELS: Record<AdminCouponDiscountType, string> =
  {
    percent: 'Percentual',
    fixed: 'Valor fixo',
    'free-shipping': 'Frete grátis',
    'first-purchase': 'Primeira compra',
    category: 'Categoria específica',
    product: 'Produto específico',
    'min-order': 'Valor mínimo do pedido',
  };

export const INFLUENCER_CHANNEL_LABELS: Record<InfluencerChannel, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export const INFLUENCER_SORT_LABELS: Record<InfluencerSortOption, string> = {
  'name-asc': 'Nome A–Z',
  'revenue-desc': 'Maior faturamento',
  'orders-desc': 'Mais pedidos',
  'usage-desc': 'Mais utilizações',
};

export const CAMPAIGN_SORT_LABELS: Record<CampaignSortOption, string> = {
  'name-asc': 'Nome A–Z',
  'start-desc': 'Início recente',
  'status-asc': 'Status',
};

export const COUPON_SORT_LABELS: Record<CouponSortOption, string> = {
  'code-asc': 'Código A–Z',
  'usage-desc': 'Mais utilizações',
  'created-desc': 'Criação recente',
  'revenue-desc': 'Maior faturamento',
};

export const INFLUENCER_STATUS_VARIANT: Record<
  AdminInfluencerStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'secondary',
  inactive: 'outline',
};

export const CAMPAIGN_STATUS_VARIANT: Record<
  AdminCampaignStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  planned: 'outline',
  active: 'secondary',
  finished: 'default',
  paused: 'destructive',
};

export const COUPON_STATUS_VARIANT: Record<
  AdminCouponStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'secondary',
  scheduled: 'outline',
  expired: 'destructive',
  paused: 'default',
  depleted: 'destructive',
};
