import type { ShippingDistanceRangeInput } from '@shared/types/shipping-config.types';

export class ShippingRangeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShippingRangeValidationError';
  }
}

export interface RangeValidationItem extends ShippingDistanceRangeInput {
  id?: string;
}

function rangesOverlap(
  a: RangeValidationItem,
  b: RangeValidationItem,
): boolean {
  return a.startKm < b.endKm && b.startKm < a.endKm;
}

export function validateShippingRangeInput(input: RangeValidationItem): void {
  if (input.startKm < 0 || input.endKm < 0) {
    throw new ShippingRangeValidationError(
      'As distâncias não podem ser negativas.',
    );
  }

  if (input.pricePerKm < 0) {
    throw new ShippingRangeValidationError(
      'O valor por KM não pode ser negativo.',
    );
  }

  if ((input.additionalFee ?? 0) < 0) {
    throw new ShippingRangeValidationError(
      'A taxa adicional não pode ser negativa.',
    );
  }

  if (input.endKm <= input.startKm) {
    throw new ShippingRangeValidationError(
      'A distância final deve ser maior que a distância inicial.',
    );
  }
}

export function validateShippingRangesCollection(
  ranges: RangeValidationItem[],
  candidate: RangeValidationItem,
  candidateId?: string,
): void {
  validateShippingRangeInput(candidate);

  const others = ranges.filter((range) => range.id !== candidateId);

  for (const existing of others) {
    if (rangesOverlap(existing, candidate)) {
      throw new ShippingRangeValidationError(
        `Faixa sobreposta detectada (${existing.startKm}–${existing.endKm} km conflita com ${candidate.startKm}–${candidate.endKm} km).`,
      );
    }

    if (
      existing.startKm === candidate.startKm &&
      existing.endKm === candidate.endKm
    ) {
      throw new ShippingRangeValidationError(
        'Já existe uma faixa com o mesmo intervalo de distância.',
      );
    }
  }
}

export function validateShippingConfigConsistency(input: {
  shippingMinFee: number;
  shippingMaxFee: number;
  distanceCalculationEnabled: boolean;
  distanceRangesEnabled: boolean;
  ranges: RangeValidationItem[];
}): void {
  if (input.shippingMinFee < 0 || input.shippingMaxFee < 0) {
    throw new ShippingRangeValidationError(
      'Frete mínimo e máximo não podem ser negativos.',
    );
  }

  if (input.shippingMaxFee > 0 && input.shippingMinFee > input.shippingMaxFee) {
    throw new ShippingRangeValidationError(
      'O frete mínimo não pode ser maior que o frete máximo.',
    );
  }

  if (input.distanceRangesEnabled && !input.distanceCalculationEnabled) {
    throw new ShippingRangeValidationError(
      'Ative o cálculo por distância para utilizar faixas.',
    );
  }

  if (input.distanceRangesEnabled) {
    const enabledRanges = input.ranges.filter(
      (range) => range.enabled !== false,
    );
    if (enabledRanges.length === 0) {
      throw new ShippingRangeValidationError(
        'Ative ao menos uma faixa de distância ou desative faixas de distância.',
      );
    }

    for (const range of enabledRanges) {
      validateShippingRangeInput(range);
    }

    for (let i = 0; i < enabledRanges.length; i += 1) {
      for (let j = i + 1; j < enabledRanges.length; j += 1) {
        if (rangesOverlap(enabledRanges[i], enabledRanges[j])) {
          throw new ShippingRangeValidationError(
            'Existem faixas de distância sobrepostas na configuração.',
          );
        }
      }
    }
  }
}
