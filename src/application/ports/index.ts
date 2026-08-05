/**
 * Output Ports — contratos que a aplicação exige da infraestrutura.
 * Ex: serviços de email, pagamento, storage, etc.
 */

export interface OutputPort {
  readonly portName: string;
}

export type {
  PaymentGatewayPort,
  CheckoutPaymentPayload,
  CheckoutPaymentIntent,
} from './payment-gateway.port';
