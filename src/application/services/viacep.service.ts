import type { CepLookupResult } from '@shared/types/checkout.types';

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export async function lookupCep(cep: string): Promise<CepLookupResult | null> {
  const normalized = cep.replace(/\D/g, '');
  if (normalized.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as ViaCepResponse;
  if (data.erro || !data.localidade || !data.uf) return null;

  return {
    street: data.logradouro ?? '',
    complement: data.complemento ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade,
    state: data.uf,
  };
}
