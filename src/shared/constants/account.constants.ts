export const ACCOUNT_STORAGE_KEY = 'underselect-account';

export const ACCOUNT_NAV_ITEMS = [
  { label: 'Dashboard', href: '/minha-conta' },
  { label: 'Meus Pedidos', href: '/pedidos' },
  { label: 'Endereços', href: '/enderecos' },
  { label: 'Dados Pessoais', href: '/dados-pessoais' },
  { label: 'Alterar Senha', href: '/alterar-senha' },
  { label: 'Favoritos', href: '/favoritos' },
  { label: 'Lista de Desejos', href: '/lista-desejos' },
  { label: 'Cupons', href: '/cupons' },
  { label: 'Configurações', href: '/configuracoes' },
] as const;

export const ACCOUNT_BOTTOM_NAV = [
  { label: 'Início', href: '/minha-conta' },
  { label: 'Pedidos', href: '/pedidos' },
  { label: 'Favoritos', href: '/favoritos' },
  { label: 'Cupons', href: '/cupons' },
] as const;

import type { OrderStatus } from '@shared/types/account.types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  processing: 'Em processamento',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const PAYMENT_METHOD_LABELS = {
  pix: 'PIX',
  card: 'Cartão de crédito',
  boleto: 'Boleto bancário',
} as const;
