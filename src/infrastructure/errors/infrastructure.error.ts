/**
 * Erros da camada de infraestrutura — falhas técnicas e de integração.
 */
export class InfrastructureError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    code = 'INFRASTRUCTURE_ERROR',
    statusCode = 500,
  ) {
    super(message);
    this.name = 'InfrastructureError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class DatabaseError extends InfrastructureError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}
