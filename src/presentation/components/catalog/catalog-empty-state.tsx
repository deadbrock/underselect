import { EmptyState } from '@presentation/components/feedback';

export type CatalogEmptyVariant = 'search' | 'category' | 'filters';

const MESSAGES: Record<
  CatalogEmptyVariant,
  { title: string; description: string; actionLabel: string }
> = {
  search: {
    title: 'Nenhum resultado encontrado',
    description:
      'Tente buscar por outro time, seleção, marca ou ajuste os filtros aplicados.',
    actionLabel: 'Limpar busca',
  },
  category: {
    title: 'Categoria vazia',
    description:
      'Não há produtos disponíveis nesta categoria no momento. Explore outras coleções.',
    actionLabel: 'Ver catálogo completo',
  },
  filters: {
    title: 'Nenhum produto encontrado',
    description:
      'Os filtros selecionados não retornaram resultados. Tente ampliar sua busca.',
    actionLabel: 'Limpar filtros',
  },
};

export interface CatalogEmptyStateProps {
  variant: CatalogEmptyVariant;
  onAction?: () => void;
}

export function CatalogEmptyState({
  variant,
  onAction,
}: CatalogEmptyStateProps) {
  const msg = MESSAGES[variant];

  return (
    <EmptyState
      title={msg.title}
      description={msg.description}
      action={
        onAction ? { label: msg.actionLabel, onClick: onAction } : undefined
      }
    />
  );
}

export function CatalogSearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <EmptyState
        title="Nenhum resultado encontrado"
        description={`Não encontramos produtos para "${query}". Tente outro termo ou explore o catálogo.`}
        action={{ label: 'Limpar busca', onClick: onClear }}
      />
    </div>
  );
}
