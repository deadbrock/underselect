import type { Repository } from '@domain/repositories';

/**
 * Implementação base de repositório via Prisma.
 * Repositórios concretos devem estender esta classe.
 */
export abstract class BasePrismaRepository<
  T,
  ID = string,
> implements Repository<T, ID> {
  abstract findById(id: ID): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: ID): Promise<void>;
}
