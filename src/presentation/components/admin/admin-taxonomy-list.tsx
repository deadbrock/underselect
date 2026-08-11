'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { EmptyState, Spinner } from '@presentation/components/feedback';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import { useClassificationStore } from '@presentation/stores/admin/classification.store';
import { formatDate } from '@shared/utils/format';
import { slugify } from '@shared/utils/slugify';

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  createdAt: string;
  productCount?: number;
}

interface AdminTaxonomyListProps {
  title: string;
  description: string;
  endpoint:
    | '/api/admin/categories'
    | '/api/admin/collections'
    | '/api/admin/teams'
    | '/api/admin/selections';
  nameLabel: string;
  slugLabel?: string;
  showSlugField?: boolean;
  autoSlugFromName?: boolean;
  showDescriptionField?: boolean;
  showPageHeader?: boolean;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Erro na requisição.');
  }
  return payload.data as T;
}

function resetFormState(setters: {
  setName: (value: string) => void;
  setSlug: (value: string) => void;
  setDescriptionValue: (value: string) => void;
  setStatus: (value: string) => void;
  setEditingId: (value: string | null) => void;
}) {
  setters.setName('');
  setters.setSlug('');
  setters.setDescriptionValue('');
  setters.setStatus('active');
  setters.setEditingId(null);
}

export const AdminTaxonomyList = memo(function AdminTaxonomyList({
  title,
  description,
  endpoint,
  nameLabel,
  slugLabel = 'Slug',
  showSlugField = false,
  autoSlugFromName = showSlugField,
  showDescriptionField = true,
  showPageHeader = true,
}: AdminTaxonomyListProps) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [status, setStatus] = useState('active');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const generatedSlug = useMemo(() => slugify(name.trim()), [name]);
  const resolvedSlug = autoSlugFromName ? generatedSlug : slug.trim();
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
          createdAt: item.createdAt,
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

  const handleEdit = useCallback((item: TaxonomyItem) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setDescriptionValue(item.description ?? '');
    setStatus(item.status);
  }, []);

  const handleCancelEdit = useCallback(() => {
    resetFormState({
      setName,
      setSlug,
      setDescriptionValue,
      setStatus,
      setEditingId,
    });
  }, []);

  const handleDelete = useCallback(
    async (item: TaxonomyItem) => {
      const linkedProducts = item.productCount ?? 0;
      const warning =
        linkedProducts > 0
          ? `\n\nEste registro possui ${linkedProducts} produto(s) vinculado(s) e não poderá ser excluído.`
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
        toast.success(`${nameLabel} excluído com sucesso.`);
        useClassificationStore.getState().invalidate();
        if (editingId === item.id) {
          handleCancelEdit();
        }
        await loadItems();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao excluir registro.',
        );
      } finally {
        setDeletingId(null);
      }
    },
    [endpoint, nameLabel, editingId, handleCancelEdit, loadItems],
  );

  const columns: Column<TaxonomyItem>[] = useMemo(
    () => [
      { key: 'name', header: nameLabel, cell: (row) => row.name },
      {
        key: 'slug',
        header: 'Slug',
        cell: (row) => <span className="font-mono text-xs">{row.slug}</span>,
        hideOnMobile: true,
      },
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <Badge variant="secondary">{row.status}</Badge>,
      },
      {
        key: 'productCount',
        header: 'Produtos',
        cell: (row) => row.productCount ?? 0,
        hideOnMobile: true,
      },
      {
        key: 'createdAt',
        header: 'Criado em',
        cell: (row) => formatDate(row.createdAt),
        hideOnMobile: true,
      },
      {
        key: 'actions',
        header: 'Ações',
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Editar ${row.name}`}
              onClick={() => handleEdit(row)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive size-8"
              aria-label={`Excluir ${row.name}`}
              disabled={deletingId === row.id}
              onClick={() => void handleDelete(row)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [nameLabel, handleEdit, handleDelete, deletingId],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (showSlugField && !resolvedSlug && !isEditing) {
      toast.error('Informe um nome válido para gerar o slug da categoria.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = showSlugField
        ? isEditing
          ? {
              label: name.trim(),
              description: descriptionValue || undefined,
              status,
            }
          : {
              label: name.trim(),
              slug: resolvedSlug,
              description: descriptionValue || undefined,
            }
        : isEditing
          ? {
              name: name.trim(),
              ...(showDescriptionField
                ? { description: descriptionValue || undefined }
                : {}),
              status,
            }
          : {
              name: name.trim(),
              ...(showDescriptionField
                ? { description: descriptionValue || undefined }
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
        isEditing
          ? `${nameLabel} atualizado com sucesso.`
          : `${nameLabel} criado com sucesso.`,
      );
      useClassificationStore.getState().invalidate();
      handleCancelEdit();
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
    <div className="space-y-6">
      {showPageHeader && <PageHeader title={title} description={description} />}
      {!showPageHeader && (
        <div>
          <h2 className="text-lg font-medium tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      )}

      <Card className="shadow-none">
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isEditing && (
              <div className="bg-muted/50 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>Editando registro</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2"
                  onClick={handleCancelEdit}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor={`taxonomy-name-${endpoint}`}>{nameLabel}</Label>
              <Input
                id={`taxonomy-name-${endpoint}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            {showSlugField && (
              <div className="space-y-2">
                <Label htmlFor={`taxonomy-slug-${endpoint}`}>{slugLabel}</Label>
                <Input
                  id={`taxonomy-slug-${endpoint}`}
                  value={isEditing ? slug : resolvedSlug}
                  readOnly
                  className="bg-muted font-mono text-sm"
                />
                {autoSlugFromName && !isEditing && (
                  <p className="text-muted-foreground text-xs">
                    Gerado automaticamente a partir do nome da categoria.
                  </p>
                )}
                {isEditing && (
                  <p className="text-muted-foreground text-xs">
                    O slug não é alterado após a criação.
                  </p>
                )}
              </div>
            )}
            {showDescriptionField && (
              <div className="space-y-2">
                <Label htmlFor={`taxonomy-description-${endpoint}`}>
                  Descrição
                </Label>
                <Input
                  id={`taxonomy-description-${endpoint}`}
                  value={descriptionValue}
                  onChange={(event) => setDescriptionValue(event.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting}>
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
        <div className="flex justify-center py-16">
          <Spinner className="size-8" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum registro encontrado"
          description="Cadastre o primeiro item usando o formulário acima."
          className="py-16"
        />
      ) : (
        <Card className="shadow-none">
          <CardContent className="p-0">
            <DataTable
              data={items}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
});
