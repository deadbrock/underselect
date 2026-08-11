import { calculateShipping } from './shipping-calculation.service';

export {
  calculateShipping,
  calculateShippingQuote,
  calculateShippingFeeForOrder,
} from './shipping-calculation.service';

export interface LegacyShippingQuoteInput {
  destinationCep: string;
  items: Array<{ productId: string; quantity: number }>;
  subtotal: number;
  couponCode?: string;
}

export async function calculateLegacyShippingQuote(
  input: LegacyShippingQuoteInput,
) {
  const { quote } = await calculateShipping({
    destinationCep: input.destinationCep,
    subtotal: input.subtotal,
    couponCode: input.couponCode,
  });
  return quote;
}
