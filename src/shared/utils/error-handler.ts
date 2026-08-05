import { DomainError } from '@domain/errors';
import { ApplicationError } from '@application/errors';
import { InfrastructureError } from '@infrastructure/errors';
import type { ApiResponse } from '@shared/types';

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof DomainError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof ApplicationError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof InfrastructureError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
}

export function toApiResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function toApiErrorResponse(error: unknown): ApiResponse<never> {
  const normalized = normalizeError(error);
  return {
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
    },
  };
}
