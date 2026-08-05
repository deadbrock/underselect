/**
 * Mappers — conversão entre entidades de domínio e DTOs.
 * Mantém a camada de apresentação desacoplada do domínio.
 */

export interface Mapper<TDomain, TDTO> {
  toDTO(domain: TDomain): TDTO;
  toDomain(dto: TDTO): TDomain;
}
