export type PaymentMethod = 'pix' | 'card' | 'boleto';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  phone: string;
  createAccount: boolean;
}

export interface CheckoutAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
}

export interface CheckoutFormValues extends CheckoutCustomer, CheckoutAddress {
  paymentMethod: PaymentMethod;
  cardInstallments: number;
}

export interface CheckoutOrderResult {
  orderId: string;
  paymentMethod: PaymentMethod;
  total: number;
  createdAt: string;
}

export interface CepLookupResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

/** Payload preparado para integração futura com InfinitePay */
export interface CheckoutPaymentPayload {
  orderId: string;
  amount: number;
  currency: 'BRL';
  paymentMethod: PaymentMethod;
  installments?: number;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
}

export interface CheckoutPaymentIntent {
  provider: 'infinitepay';
  intentId: string;
  status: 'pending' | 'succeeded' | 'failed';
  redirectUrl?: string;
  pixQrCode?: string;
  boletoUrl?: string;
}
