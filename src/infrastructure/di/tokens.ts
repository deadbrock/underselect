/**
 * Tokens de injeção de dependência — identificadores únicos para o container.
 */
export const DI_TOKENS = {
  LOGGER: Symbol('LOGGER'),
  PRISMA: Symbol('PRISMA'),
} as const;

export type DIToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS];
