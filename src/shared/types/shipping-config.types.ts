export interface ShippingDistanceRange {
  id: string;
  startKm: number;
  endKm: number;
  pricePerKm: number;
  additionalFee: number;
  enabled: boolean;
  sortOrder: number;
}

export interface ShippingDistanceRangeInput {
  startKm: number;
  endKm: number;
  pricePerKm: number;
  additionalFee?: number;
  enabled?: boolean;
  sortOrder?: number;
}

export interface AdminShippingConfig {
  shippingBaseFee: number;
  shippingPerKm: number;
  shippingMinFee: number;
  shippingMaxFee: number;
  freeShippingEnabled: boolean;
  freeShippingMinValue: number;
  distanceCalculationEnabled: boolean;
  distanceRangesEnabled: boolean;
  shippingOriginCep: string;
  shippingOriginCity: string;
  shippingOriginState: string;
  estimatedDelivery: string;
  ranges: ShippingDistanceRange[];
}

export interface ShippingCalculationBreakdown {
  distanceKm: number;
  baseFee: number;
  perKmRate: number;
  distanceComponent: number;
  additionalFee: number;
  calculatedFee: number;
  minFee: number;
  maxFee: number;
  minFeeApplied: boolean;
  maxFeeApplied: boolean;
  freeShippingApplied: boolean;
  freeShippingReason?: 'threshold' | 'coupon';
  finalFee: number;
  appliedRange?: ShippingDistanceRange;
  destinationAddress?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}
