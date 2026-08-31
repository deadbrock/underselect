'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Monitor, Smartphone } from 'lucide-react';
import { memo, useCallback } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@presentation/components/ui';
import { useCatalogVersionStore } from '@presentation/stores/admin/catalog-version.store';
import {
  ADMIN_CATALOG_MOBILE_PATH,
  isAdminMobileCatalogPath,
} from '@shared/constants/admin.constants';
import { cn } from '@shared/utils/cn';

const WEB_CATALOG_HREF = '/admin/produtos';

export const CatalogVersionDialog = memo(function CatalogVersionDialog() {
  const router = useRouter();
  const isOpen = useCatalogVersionStore((state) => state.isDialogOpen);
  const closeDialog = useCatalogVersionStore((state) => state.closeDialog);
  const expandWebCatalog = useCatalogVersionStore(
    (state) => state.expandWebCatalog,
  );
  const collapseWebCatalog = useCatalogVersionStore(
    (state) => state.collapseWebCatalog,
  );

  const handleWeb = useCallback(() => {
    expandWebCatalog();
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (isAdminMobileCatalogPath(pathname)) {
        router.push(WEB_CATALOG_HREF as Route);
      }
    }
  }, [expandWebCatalog, router]);

  const handleMobile = useCallback(() => {
    collapseWebCatalog();
    router.push(ADMIN_CATALOG_MOBILE_PATH as Route);
  }, [collapseWebCatalog, router]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-md sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Qual versão você deseja utilizar?</DialogTitle>
          <DialogDescription>
            Escolha o catálogo completo no computador ou a versão simplificada
            para celular. A estrutura atual do sistema permanece a mesma.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleWeb}
            className={cn(
              'border-border hover:border-foreground focus-visible:ring-ring flex min-h-36 flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:ring-1 focus-visible:outline-none',
            )}
          >
            <Monitor className="size-6" aria-hidden />
            <span className="text-sm font-medium">Versão Web (PC)</span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              Gestão completa de produtos, categorias, coleções, times e
              seleções.
            </span>
          </button>

          <button
            type="button"
            onClick={handleMobile}
            className={cn(
              'border-border hover:border-foreground focus-visible:ring-ring flex min-h-36 flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:ring-1 focus-visible:outline-none',
            )}
          >
            <Smartphone className="size-6" aria-hidden />
            <span className="text-sm font-medium">Versão Mobile</span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              Cadastro rápido: fotos, descrição, tamanhos, quantidade e valor
              unitário.
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
