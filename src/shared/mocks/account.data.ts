import type {
  AccountAddress,
  AccountCoupon,
  AccountDashboardStats,
  AccountOrder,
  AccountSettings,
  AccountUser,
} from '@shared/types/account.types';
import { CATALOG_PRODUCTS } from '@shared/mocks/catalog.utils';

const defaultAddress: AccountAddress = {
  id: 'addr-1',
  label: 'Casa',
  cep: '01310100',
  street: 'Av. Paulista',
  number: '1000',
  complement: 'Apto 42',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  reference: 'Próximo ao MASP',
  isDefault: true,
};

export const MOCK_ACCOUNT_USER: AccountUser = {
  id: 'user-1',
  firstName: 'Rafael',
  lastName: 'Souza',
  email: 'rafael.souza@email.com',
  cpf: '12345678909',
  phone: '11999998888',
  birthDate: '1992-05-15',
  marketingEmail: true,
  marketingSms: false,
  newsletter: true,
};

export const MOCK_ACCOUNT_ADDRESSES: AccountAddress[] = [
  defaultAddress,
  {
    id: 'addr-2',
    label: 'Trabalho',
    cep: '20040020',
    street: 'Praça Pio X',
    number: '50',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    isDefault: false,
  },
];

export const MOCK_ACCOUNT_SETTINGS: AccountSettings = {
  themePreference: 'system',
  orderNotifications: true,
  promoNotifications: true,
  newsletter: true,
  promotionalCommunication: false,
};

const orderItems = CATALOG_PRODUCTS.slice(0, 2).map((p, i) => ({
  productId: p.id,
  slug: p.slug,
  name: p.name,
  imageUrl: p.imageUrl,
  quantity: i === 0 ? 1 : 2,
  price: p.price,
  size: p.sizes[0] ?? 'M',
  colorLabel: 'Principal',
}));

export const MOCK_ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: 'ord-1',
    number: 'US-MOCK001',
    status: 'delivered',
    createdAt: '2026-07-28T14:30:00.000Z',
    itemCount: 3,
    subtotal: orderItems.reduce((a, i) => a + i.price * i.quantity, 0),
    shipping: 19.9,
    discount: 44.9,
    total: 863.8,
    paymentMethod: 'pix',
    shippingAddress: defaultAddress,
    items: orderItems,
    trackingCode: 'BR123456789US',
    timeline: [
      {
        id: 't1',
        label: 'Pedido confirmado',
        description: 'Recebemos seu pedido.',
        date: '2026-07-28T14:30:00.000Z',
        completed: true,
      },
      {
        id: 't2',
        label: 'Pagamento aprovado',
        description: 'PIX confirmado.',
        date: '2026-07-28T14:32:00.000Z',
        completed: true,
      },
      {
        id: 't3',
        label: 'Em separação',
        description: 'Produtos sendo preparados.',
        date: '2026-07-29T09:00:00.000Z',
        completed: true,
      },
      {
        id: 't4',
        label: 'Enviado',
        description: 'Pedido despachado.',
        date: '2026-07-30T11:00:00.000Z',
        completed: true,
      },
      {
        id: 't5',
        label: 'Entregue',
        description: 'Pedido entregue ao destinatário.',
        date: '2026-08-05T16:20:00.000Z',
        completed: true,
      },
    ],
  },
  {
    id: 'ord-2',
    number: 'US-MOCK002',
    status: 'shipped',
    createdAt: '2026-08-10T10:00:00.000Z',
    itemCount: 1,
    subtotal: CATALOG_PRODUCTS[4]!.price,
    shipping: 39.9,
    discount: 0,
    total: CATALOG_PRODUCTS[4]!.price + 39.9,
    paymentMethod: 'card',
    shippingAddress: defaultAddress,
    items: [
      {
        productId: CATALOG_PRODUCTS[4]!.id,
        slug: CATALOG_PRODUCTS[4]!.slug,
        name: CATALOG_PRODUCTS[4]!.name,
        imageUrl: CATALOG_PRODUCTS[4]!.imageUrl,
        quantity: 1,
        price: CATALOG_PRODUCTS[4]!.price,
        size: 'G',
        colorLabel: 'Principal',
      },
    ],
    trackingCode: 'BR987654321US',
    timeline: [
      {
        id: 't1',
        label: 'Pedido confirmado',
        description: 'Recebemos seu pedido.',
        date: '2026-08-10T10:00:00.000Z',
        completed: true,
      },
      {
        id: 't2',
        label: 'Pagamento aprovado',
        description: 'Cartão autorizado.',
        date: '2026-08-10T10:05:00.000Z',
        completed: true,
      },
      {
        id: 't3',
        label: 'Em separação',
        description: 'Produtos sendo preparados.',
        date: '2026-08-11T08:00:00.000Z',
        completed: true,
      },
      {
        id: 't4',
        label: 'Enviado',
        description: 'Pedido despachado.',
        date: '2026-08-12T14:00:00.000Z',
        completed: true,
      },
      {
        id: 't5',
        label: 'Entregue',
        description: 'Aguardando entrega.',
        date: '',
        completed: false,
      },
    ],
  },
  {
    id: 'ord-3',
    number: 'US-MOCK003',
    status: 'processing',
    createdAt: '2026-08-15T18:45:00.000Z',
    itemCount: 2,
    subtotal: 538,
    shipping: 19.9,
    discount: 53.8,
    total: 504.1,
    paymentMethod: 'boleto',
    shippingAddress: defaultAddress,
    items: CATALOG_PRODUCTS.slice(6, 8).map((p) => ({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      imageUrl: p.imageUrl,
      quantity: 1,
      price: p.price,
      size: 'M',
      colorLabel: 'Padrão',
    })),
    timeline: [
      {
        id: 't1',
        label: 'Pedido confirmado',
        description: 'Recebemos seu pedido.',
        date: '2026-08-15T18:45:00.000Z',
        completed: true,
      },
      {
        id: 't2',
        label: 'Pagamento aprovado',
        description: 'Aguardando compensação do boleto.',
        date: '',
        completed: false,
      },
      {
        id: 't3',
        label: 'Em separação',
        description: 'Produtos sendo preparados.',
        date: '',
        completed: false,
      },
      {
        id: 't4',
        label: 'Enviado',
        description: 'Pedido despachado.',
        date: '',
        completed: false,
      },
      {
        id: 't5',
        label: 'Entregue',
        description: 'Pedido entregue ao destinatário.',
        date: '',
        completed: false,
      },
    ],
  },
];

export const MOCK_ACCOUNT_COUPONS: AccountCoupon[] = [
  {
    code: 'UNDER10',
    label: '10% de desconto',
    status: 'available',
    expiresAt: '2026-12-31',
  },
  {
    code: 'FRETEGRATIS',
    label: 'Frete grátis',
    status: 'available',
    expiresAt: '2026-09-30',
  },
  {
    code: 'BEMVINDO',
    label: '15% na primeira compra',
    status: 'used',
    usedAt: '2026-07-28',
  },
  {
    code: 'EXPIRADO',
    label: '20% de desconto',
    status: 'expired',
    expiresAt: '2025-12-01',
  },
];

export const MOCK_FAVORITE_IDS = ['cat-1', 'cat-5', 'cat-9', 'cat-12'];

export const MOCK_WISHLIST_IDS = ['cat-3', 'cat-7', 'cat-15'];

export const MOCK_RECENTLY_VIEWED_IDS = [
  'cat-1',
  'cat-2',
  'cat-5',
  'cat-8',
  'cat-11',
];

export function getDashboardStats(
  favoriteCount: number,
): AccountDashboardStats {
  return {
    totalOrders: MOCK_ACCOUNT_ORDERS.length,
    totalSpent: MOCK_ACCOUNT_ORDERS.reduce((a, o) => a + o.total, 0),
    favoriteCount,
    availableCoupons: MOCK_ACCOUNT_COUPONS.filter(
      (c) => c.status === 'available',
    ).length,
  };
}

export function getOrderById(id: string): AccountOrder | undefined {
  return MOCK_ACCOUNT_ORDERS.find((o) => o.id === id);
}

export function getAllOrderIds(): string[] {
  return MOCK_ACCOUNT_ORDERS.map((o) => o.id);
}

export function getProductsByIds(ids: string[]) {
  return ids
    .map((id) => CATALOG_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);
}
