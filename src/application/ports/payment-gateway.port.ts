/**
 * Porta de saída para gateway de pagamento (InfinitePay).
 * Implementação real ficará na camada infrastructure.
 */
import type {
  CheckoutPaymentIntent,
  CheckoutPaymentPayload,
} from '@shared/types/checkout.types';

export interface PaymentGatewayPort {
  readonly provider: 'infinitepay';
  createPaymentIntent(
    payload: CheckoutPaymentPayload,
  ): Promise<CheckoutPaymentIntent>;
}

export type { CheckoutPaymentPayload, CheckoutPaymentIntent };
