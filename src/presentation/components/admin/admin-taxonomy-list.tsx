'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { EmptyState, Spinner } from '@presentation/components/feedback';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import { formatDate } from '@shared/utils/format';

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
  showPageHeader?: boolean;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Erro na requisição.');
  }
  return payload.data as T;
}

export const AdminTaxonomyList = memo(function AdminTaxonomyList({
  title,
  description,
  endpoint,
  nameLabel,
  slugLabel = 'Slug',
  showSlugField = false,
  showPageHeader = true,
}: AdminTaxonomyListProps) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    ],
    [nameLabel],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const body = showSlugField
        ? { label: name, slug, description: descriptionValue || undefined }
        : { name, description: descriptionValue || undefined };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await parseApiResponse(response);
      toast.success(`${nameLabel} criado com sucesso.`);
      setName('');
      setSlug('');
      setDescriptionValue('');
      await loadItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar registro.',
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
            <div className="space-y-2">
              <Label htmlFor="taxonomy-name">{nameLabel}</Label>
              <Input
                id="taxonomy-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            {showSlugField && (
              <div className="space-y-2">
                <Label htmlFor="taxonomy-slug">{slugLabel}</Label>
                <Input
                  id="taxonomy-slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  pattern="^[a-z0-9-]+$"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="taxonomy-description">Descrição</Label>
              <Input
                id="taxonomy-description"
                value={descriptionValue}
                onChange={(event) => setDescriptionValue(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Salvando...'
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
