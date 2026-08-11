'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Archive, Copy, Eye, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { memo } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { useProductStore } from '@presentation/stores/admin/product';
import type { AdminProduct } from '@shared/types/product-admin.types';

export interface AdminProductActionsProps {
  product: AdminProduct;
  compact?: boolean;
}

export const AdminProductActions = memo(function AdminProductActions({
  product,
  compact = false,
}: AdminProductActionsProps) {
  const duplicateProduct = useProductStore((s) => s.duplicateProduct);
  const archiveProduct = useProductStore((s) => s.archiveProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const handleDuplicate = async () => {
    try {
      await duplicateProduct(product.id);
      toast.success('Produto duplicado como rascunho.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao duplicar produto.',
      );
    }
  };

  const handleArchive = async () => {
    try {
      await archiveProduct(product.id);
      toast.success('Produto arquivado.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao arquivar produto.',
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast.success('Produto excluído.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir produto.',
      );
    }
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8">
            Ações
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/produtos/${product.id}` as Route}>
              Visualizar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/produtos/${product.id}/editar` as Route}>
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleArchive}>Arquivar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        asChild
      >
        <Link
          href={`/admin/produtos/${product.id}` as Route}
          aria-label={`Ver ${product.name}`}
        >
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        asChild
      >
        <Link
          href={`/produto/${product.slug}` as Route}
          target="_blank"
          aria-label={`Ver na loja ${product.name}`}
        >
          <ExternalLink className="size-4" />
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        asChild
      >
        <Link
          href={`/admin/produtos/${product.id}/editar` as Route}
          aria-label={`Editar ${product.name}`}
        >
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Duplicar ${product.name}`}
        onClick={handleDuplicate}
      >
        <Copy className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Arquivar ${product.name}`}
        onClick={handleArchive}
      >
        <Archive className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Excluir ${product.name}`}
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
});
