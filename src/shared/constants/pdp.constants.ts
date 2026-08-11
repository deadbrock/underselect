export const SIZE_OUT_OF_STOCK_MESSAGE =
  'Este tamanho não está disponível no momento por falta de estoque.';

export const SIZE_SELECTION_REQUIRED_MESSAGE =
  'Selecione tamanho, cor e modelo para continuar.';

export function getSizeOutOfStockMessage(size: string) {
  return `O tamanho ${size} não está disponível no momento por falta de estoque.`;
}
