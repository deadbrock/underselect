/**
 * Entidade base do domínio.
 * Todas as entidades de negócio devem estender esta classe.
 */
export abstract class Entity<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return JSON.stringify(this.props) === JSON.stringify(entity.props);
  }
}
