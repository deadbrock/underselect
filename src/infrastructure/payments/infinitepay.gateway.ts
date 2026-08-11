import type { PaymentGatewayPort } from '@application/ports';
import {
  createInfinitePayCheckoutLink,
  type CreateInfinitePayLinkInput,
} from '@application/services';
import type {
  CheckoutPaymentIntent,
  CheckoutPaymentPayload,
} from '@shared/types/checkout.types';

export class InfinitePayGateway implements PaymentGatewayPort {
  readonly provider = 'infinitepay' as const;

  async createPaymentIntent(
    payload: CheckoutPaymentPayload & {
      orderNsu: string;
      items: CreateInfinitePayLinkInput['items'];
      redirectUrl: string;
      webhookUrl: string;
      customer?: CreateInfinitePayLinkInput['customer'];
      address?: CreateInfinitePayLinkInput['address'];
    },
  ): Promise<CheckoutPaymentIntent> {
    const link = await createInfinitePayCheckoutLink({
      orderNsu: payload.orderNsu,
      items: payload.items,
      redirectUrl: payload.redirectUrl,
      webhookUrl: payload.webhookUrl,
      customer: payload.customer,
      address: payload.address,
    });

    return {
      provider: 'infinitepay',
      intentId: payload.orderNsu,
      status: 'pending',
      redirectUrl: link.url,
    };
  }
}

export const infinitePayGateway = new InfinitePayGateway();
