/**
 * Contrato base para repositórios do domínio.
 * Implementações concretas ficam na camada de infraestrutura.
 */
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}
