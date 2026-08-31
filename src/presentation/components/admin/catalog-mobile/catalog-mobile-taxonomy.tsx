'use client';

import { Pencil, Trash2, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { useClassificationStore } from '@presentation/stores/admin/classification.store';
import { slugify } from '@shared/utils/slugify';

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  productCount?: number;
}

export interface CatalogMobileTaxonomyProps {
  endpoint:
    | '/api/admin/categories'
    | '/api/admin/collections'
    | '/api/admin/teams'
    | '/api/admin/selections';
  nameLabel: string;
  showSlugField?: boolean;
  showDescriptionField?: boolean;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Erro na requisição.');
  }
  return payload.data as T;
}

export const CatalogMobileTaxonomy = memo(function CatalogMobileTaxonomy({
  endpoint,
  nameLabel,
  showSlugField = false,
  showDescriptionField = false,
}: CatalogMobileTaxonomyProps) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const generatedSlug = useMemo(() => slugify(name.trim()), [name]);
  const isEditing = editingId != null;

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      const data = await parseApiResponse<
        Array<
          TaxonomyItem & {
            label?: string;
            _count?: { products: number };
          }
        >
      >(response);

      setItems(
        data.map((item) => ({
          id: item.id,
          name: item.name ?? item.label ?? '',
          slug: item.slug,
          description: item.description,
          status: item.status,
          productCount: item._count?.products,
        })),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao carregar registros.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setEditingId(null);
  }, []);

  const handleEdit = useCallback((item: TaxonomyItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? '');
  }, []);

  const handleDelete = useCallback(
    async (item: TaxonomyItem) => {
      const warning =
        (item.productCount ?? 0) > 0
          ? `\n\nEste registro possui ${item.productCount} produto(s) vinculado(s).`
          : '';

      if (
        !window.confirm(
          `Excluir "${item.name}"? Esta ação não pode ser desfeita.${warning}`,
        )
      ) {
        return;
      }

      setDeletingId(item.id);
      try {
        const response = await fetch(`${endpoint}/${item.id}`, {
          method: 'DELETE',
        });
        await parseApiResponse(response);
        toast.success(`${nameLabel} excluído.`);
        useClassificationStore.getState().invalidate();
        if (editingId === item.id) resetForm();
        await loadItems();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao excluir registro.',
        );
      } finally {
        setDeletingId(null);
      }
    },
    [endpoint, nameLabel, editingId, resetForm, loadItems],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error(`Informe o nome d${nameLabel.toLowerCase()}.`);
      return;
    }

    if (showSlugField && !generatedSlug && !isEditing) {
      toast.error('Informe um nome válido para gerar o identificador.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = showSlugField
        ? isEditing
          ? {
              label: name.trim(),
              description: description || undefined,
              status: 'active',
            }
          : {
              label: name.trim(),
              slug: generatedSlug,
              description: description || undefined,
            }
        : isEditing
          ? {
              name: name.trim(),
              ...(showDescriptionField
                ? { description: description || undefined }
                : {}),
              status: 'active',
            }
          : {
              name: name.trim(),
              ...(showDescriptionField
                ? { description: description || undefined }
                : {}),
            };

      const response = await fetch(
        isEditing ? `${endpoint}/${editingId}` : endpoint,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      await parseApiResponse(response);
      toast.success(
        isEditing ? `${nameLabel} atualizado.` : `${nameLabel} adicionado.`,
      );
      useClassificationStore.getState().invalidate();
      resetForm();
      await loadItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar registro.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-none">
        <CardContent className="p-4">
          <form
            className="space-y-3"
            onSubmit={(event) => void handleSubmit(event)}
          >
            {isEditing && (
              <div className="flex items-center justify-between text-sm">
                <span>Editando {nameLabel.toLowerCase()}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2"
                  onClick={resetForm}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor={`mobile-taxonomy-${endpoint}`}>{nameLabel}</Label>
              <Input
                id={`mobile-taxonomy-${endpoint}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11"
                required
              />
            </div>
            {showDescriptionField && (
              <div className="space-y-2">
                <Label htmlFor={`mobile-taxonomy-desc-${endpoint}`}>
                  Descrição
                </Label>
                <Input
                  id={`mobile-taxonomy-desc-${endpoint}`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="h-11"
                />
              </div>
            )}
            <Button
              type="submit"
              className="min-h-11 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Salvando...'
                : isEditing
                  ? `Salvar ${nameLabel.toLowerCase()}`
                  : `Adicionar ${nameLabel.toLowerCase()}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12" role="status">
          <Spinner className="size-8" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`Nenhum ${nameLabel.toLowerCase()}`}
          description={`Adicione o primeiro ${nameLabel.toLowerCase()} usando o formulário acima.`}
          className="py-10"
        />
      ) : (
        <ul className="space-y-2" aria-label={nameLabel}>
          {items.map((item) => (
            <li key={item.id}>
              <Card className="shadow-none">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    {item.productCount != null && (
                      <p className="text-muted-foreground text-xs">
                        {item.productCount} produto(s)
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-10"
                    aria-label={`Editar ${item.name}`}
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive size-10"
                    aria-label={`Excluir ${item.name}`}
                    disabled={deletingId === item.id}
                    onClick={() => void handleDelete(item)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
