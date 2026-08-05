import { env } from '@infrastructure/config';
import { prisma } from '@infrastructure/database';
import { ConsoleLogger } from '@infrastructure/logger';
import type { Logger } from '@infrastructure/logger';
import { DI_TOKENS } from './tokens';

type Factory<T> = () => T;

/**
 * Container de injeção de dependência simples.
 * Registre implementações concretas aqui conforme funcionalidades forem adicionadas.
 */
class Container {
  private readonly services = new Map<symbol, Factory<unknown>>();

  register<T>(token: symbol, factory: Factory<T>): void {
    this.services.set(token, factory);
  }

  resolve<T>(token: symbol): T {
    const factory = this.services.get(token);

    if (!factory) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    return factory() as T;
  }
}

export const container = new Container();

container.register<Logger>(
  DI_TOKENS.LOGGER,
  () => new ConsoleLogger(env.LOG_LEVEL),
);

container.register(DI_TOKENS.PRISMA, () => prisma);

export function getLogger(): Logger {
  return container.resolve<Logger>(DI_TOKENS.LOGGER);
}
