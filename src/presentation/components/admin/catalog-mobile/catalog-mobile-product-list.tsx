'use client';

import Image from 'next/image';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { useProductStore } from '@presentation/stores/admin/product';
import { ADMIN_CATALOG_MOBILE_PATH } from '@shared/constants/admin.constants';
import { formatCurrency } from '@shared/utils/format';

export const CatalogMobileProductList = memo(
  function CatalogMobileProductList() {
    const router = useRouter();
    const products = useProductStore((state) => state.products);
    const loadProducts = useProductStore((state) => state.loadProducts);
    const deleteProduct = useProductStore((state) => state.deleteProduct);
    const isHydrated = useProductStore((state) => state.isHydrated);
    const isLoading = useProductStore((state) => state.isLoading);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
      void loadProducts(true);
    }, [loadProducts]);

    const filtered = useMemo(() => {
      const query = search.trim().toLowerCase();
      if (!query) return products;
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.team?.toLowerCase().includes(query) ||
          product.selection?.toLowerCase().includes(query) ||
          product.collection.toLowerCase().includes(query),
      );
    }, [products, search]);

    const goToEdit = useCallback(
      (id: string) => {
        router.push(`${ADMIN_CATALOG_MOBILE_PATH}/${id}/editar` as Route);
      },
      [router],
    );

    const handleDelete = useCallback(
      async (id: string, name: string) => {
        if (
          !window.confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)
        ) {
          return;
        }

        setDeletingId(id);
        try {
          await deleteProduct(id);
          toast.success('Produto excluído.');
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : 'Erro ao excluir produto.',
          );
        } finally {
          setDeletingId(null);
        }
      },
      [deleteProduct],
    );

    return (
      <div className="space-y-4">
        <Button
          type="button"
          className="min-h-12 w-full"
          onClick={() =>
            router.push(`${ADMIN_CATALOG_MOBILE_PATH}/novo` as Route)
          }
        >
          <Plus className="size-4" />
          Adicionar produto
        </Button>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto, time ou seleção"
            className="h-11 pl-9"
            aria-label="Buscar produto"
          />
        </div>

        {!isHydrated || isLoading ? (
          <div className="flex justify-center py-16" role="status">
            <Spinner className="size-8" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum produto"
            description="Cadastre o primeiro produto com fotos, descrição, tamanhos, quantidade e valor."
            className="py-12"
          />
        ) : (
          <ul className="space-y-3" aria-label="Produtos">
            {filtered.map((product) => (
              <li key={product.id}>
                <Card className="shadow-none">
                  <CardContent className="flex gap-3 p-3">
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 gap-3 text-left"
                      onClick={() => goToEdit(product.id)}
                    >
                      <div className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-md">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.imageAlt || product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized={product.imageUrl.startsWith(
                              '/uploads/',
                            )}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-sm font-medium tabular-nums">
                          {formatCurrency(product.price)}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-muted-foreground text-xs">
                            {product.stockQuantity} un.
                          </span>
                          {product.team && (
                            <Badge
                              variant="secondary"
                              className="text-[0.625rem]"
                            >
                              {product.team}
                            </Badge>
                          )}
                          {product.selection && (
                            <Badge
                              variant="secondary"
                              className="text-[0.625rem]"
                            >
                              {product.selection}
                            </Badge>
                          )}
                          {product.collection && (
                            <Badge
                              variant="outline"
                              className="text-[0.625rem]"
                            >
                              {product.collection}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-10"
                        aria-label={`Editar ${product.name}`}
                        onClick={() => goToEdit(product.id)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive size-10"
                        aria-label={`Excluir ${product.name}`}
                        disabled={deletingId === product.id}
                        onClick={() =>
                          void handleDelete(product.id, product.name)
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
