import type { DomainError } from '@domain/errors';

/**
 * Resultado funcional para use cases — evita exceções para fluxos esperados.
 */
export type Result<T, E = DomainError> =
  { success: true; data: T } | { success: false; error: E };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<E = DomainError>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Use Case base — toda operação de aplicação deve implementar esta interface.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<Result<TOutput>>;
}
