'use client';

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { Monitor, Smartphone } from 'lucide-react';
import { memo, useCallback, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@presentation/components/ui';
import { useIsMobile } from '@presentation/hooks';
import { useCatalogVersionStore } from '@presentation/stores/admin/catalog-version.store';
import {
  ADMIN_CATALOG_MOBILE_PATH,
  isAdminMobileCatalogPath,
  isAdminWebCatalogPath,
} from '@shared/constants/admin.constants';
import { cn } from '@shared/utils/cn';

const WEB_CATALOG_HREF = '/admin/produtos';

const VERSION_CARD_CLASS =
  'border-border hover:border-foreground focus-visible:ring-ring flex min-h-32 flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:ring-1 focus-visible:outline-none';

export const CatalogVersionDialog = memo(function CatalogVersionDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isOpen = useCatalogVersionStore((state) => state.isDialogOpen);
  const chosenVersion = useCatalogVersionStore((state) => state.chosenVersion);
  const closeDialog = useCatalogVersionStore((state) => state.closeDialog);
  const openDialog = useCatalogVersionStore((state) => state.openDialog);
  const expandWebCatalog = useCatalogVersionStore(
    (state) => state.expandWebCatalog,
  );
  const collapseWebCatalog = useCatalogVersionStore(
    (state) => state.collapseWebCatalog,
  );
  const hydrateFromStorage = useCatalogVersionStore(
    (state) => state.hydrateFromStorage,
  );
  const autoPrompted = useCatalogVersionStore((state) => state.autoPrompted);
  const markAutoPrompted = useCatalogVersionStore(
    (state) => state.markAutoPrompted,
  );

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!isMobile) return;
    if (isAdminMobileCatalogPath(pathname)) return;
    if (!isAdminWebCatalogPath(pathname)) return;
    if (chosenVersion === 'web') return;
    if (chosenVersion === 'mobile') {
      router.replace(ADMIN_CATALOG_MOBILE_PATH as Route);
      return;
    }
    if (autoPrompted) return;
    markAutoPrompted();
    openDialog();
  }, [
    autoPrompted,
    chosenVersion,
    isMobile,
    markAutoPrompted,
    openDialog,
    pathname,
    router,
  ]);

  const handleWeb = useCallback(() => {
    expandWebCatalog();
    if (!isAdminWebCatalogPath(pathname)) {
      router.push(WEB_CATALOG_HREF as Route);
    }
  }, [expandWebCatalog, pathname, router]);

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
            para celular.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleWeb}
            className={cn(VERSION_CARD_CLASS)}
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
            className={cn(VERSION_CARD_CLASS)}
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
