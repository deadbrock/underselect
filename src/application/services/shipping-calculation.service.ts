import { getCouponByCode } from '@infrastructure/database/repositories/coupon.repository';
import { getShippingConfig } from '@infrastructure/database/repositories/shipping-config.repository';
import {
  couponGrantsFreeShipping,
  roundMoney,
} from './coupon-validation.service';
import { getDistanceKmBetweenCeps } from './shipping-distance.service';
import { lookupCep } from './viacep.service';
import type { ShippingQuote } from '@shared/types/cart.types';
import type {
  AdminShippingConfig,
  ShippingCalculationBreakdown,
  ShippingDistanceRange,
} from '@shared/types/shipping-config.types';

export interface ShippingCalculationInput {
  destinationCep: string;
  subtotal: number;
  couponCode?: string;
}

function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, '').slice(0, 8);
}

function findRangeForDistance(
  ranges: ShippingDistanceRange[],
  distanceKm: number,
): ShippingDistanceRange | null {
  const enabledRanges = ranges
    .filter((range) => range.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    enabledRanges.find(
      (range) => distanceKm >= range.startKm && distanceKm < range.endKm,
    ) ?? null
  );
}

function applyMinMax(
  value: number,
  minFee: number,
  maxFee: number,
): {
  value: number;
  minFeeApplied: boolean;
  maxFeeApplied: boolean;
} {
  let result = value;
  let minFeeApplied = false;
  let maxFeeApplied = false;

  if (minFee > 0 && result < minFee) {
    result = minFee;
    minFeeApplied = true;
  }

  if (maxFee > 0 && result > maxFee) {
    result = maxFee;
    maxFeeApplied = true;
  }

  return { value: roundMoney(result), minFeeApplied, maxFeeApplied };
}

async function resolveFreeShipping(
  config: AdminShippingConfig,
  subtotal: number,
  couponCode?: string,
): Promise<{ applied: boolean; reason?: 'threshold' | 'coupon' }> {
  if (
    config.freeShippingEnabled &&
    config.freeShippingMinValue > 0 &&
    subtotal >= config.freeShippingMinValue
  ) {
    return { applied: true, reason: 'threshold' };
  }

  if (couponCode) {
    const coupon = await getCouponByCode(couponCode.toUpperCase());
    if (coupon && couponGrantsFreeShipping(coupon)) {
      return { applied: true, reason: 'coupon' };
    }
  }

  return { applied: false };
}

export async function calculateShipping(
  input: ShippingCalculationInput,
): Promise<{
  quote: ShippingQuote;
  breakdown: ShippingCalculationBreakdown;
}> {
  const destinationCep = normalizeCep(input.destinationCep);
  if (destinationCep.length !== 8) {
    throw new Error('CEP de destino inválido.');
  }

  const config = await getShippingConfig();
  const originCep = normalizeCep(config.shippingOriginCep);

  if (originCep.length !== 8 || !config.shippingOriginState.trim()) {
    throw new Error(
      'Endereço de origem da loja não configurado. Configure em Admin → Configurações.',
    );
  }

  const destination = await lookupCep(destinationCep);
  if (!destination) {
    throw new Error('CEP de destino não encontrado.');
  }

  let distanceKm = 0;
  if (config.distanceCalculationEnabled) {
    distanceKm = await getDistanceKmBetweenCeps(originCep, destinationCep);
  }

  const baseFee = config.shippingBaseFee;
  let perKmRate = config.shippingPerKm;
  let additionalFee = 0;
  let appliedRange: ShippingDistanceRange | undefined;

  if (config.distanceCalculationEnabled && config.distanceRangesEnabled) {
    const range = findRangeForDistance(config.ranges, distanceKm);
    if (!range) {
      throw new Error(
        'Nenhuma faixa de distância configurada para a distância calculada.',
      );
    }
    perKmRate = range.pricePerKm;
    additionalFee = range.additionalFee;
    appliedRange = range;
  }

  const distanceComponent = config.distanceCalculationEnabled
    ? roundMoney(distanceKm * perKmRate)
    : 0;

  let calculatedFee = roundMoney(baseFee + distanceComponent + additionalFee);

  const {
    value: boundedFee,
    minFeeApplied,
    maxFeeApplied,
  } = applyMinMax(calculatedFee, config.shippingMinFee, config.shippingMaxFee);

  calculatedFee = boundedFee;

  const freeShipping = await resolveFreeShipping(
    config,
    input.subtotal,
    input.couponCode,
  );

  let finalFee = calculatedFee;
  if (freeShipping.applied) {
    finalFee = 0;
  }

  const breakdown: ShippingCalculationBreakdown = {
    distanceKm,
    baseFee,
    perKmRate,
    distanceComponent,
    additionalFee,
    calculatedFee,
    minFee: config.shippingMinFee,
    maxFee: config.shippingMaxFee,
    minFeeApplied,
    maxFeeApplied,
    freeShippingApplied: freeShipping.applied,
    freeShippingReason: freeShipping.reason,
    finalFee,
    appliedRange,
    destinationAddress: {
      street: destination.street,
      neighborhood: destination.neighborhood,
      city: destination.city,
      state: destination.state,
    },
  };

  const quote: ShippingQuote = {
    cep: destinationCep,
    originCep,
    originCity: config.shippingOriginCity,
    originState: config.shippingOriginState,
    options: [
      {
        id: 'padrao',
        label: freeShipping.applied
          ? 'Entrega — Frete grátis'
          : 'Entrega padrão',
        days: config.estimatedDelivery,
        price: finalFee,
      },
    ],
    selectedOptionId: 'padrao',
  };

  return { quote, breakdown };
}

export async function calculateShippingQuote(
  input: ShippingCalculationInput & {
    items?: Array<{ productId: string; quantity: number }>;
  },
): Promise<ShippingQuote> {
  const { quote } = await calculateShipping(input);
  return quote;
}

export async function calculateShippingFeeForOrder(
  input: ShippingCalculationInput,
): Promise<number> {
  const { breakdown } = await calculateShipping(input);
  return breakdown.finalFee;
}
