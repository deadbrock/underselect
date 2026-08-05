'use client';

import { Upload } from 'lucide-react';
import { memo } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';

export interface AdminProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminProductImportDialog = memo(function AdminProductImportDialog({
  open,
  onOpenChange,
}: AdminProductImportDialogProps) {
  const handleImport = (format: 'csv' | 'excel') => {
    toast.info(
      `Importação via ${format.toUpperCase()} preparada para integração futura.`,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar produtos</DialogTitle>
          <DialogDescription>
            Estrutura preparada para importação em massa. Integração com CSV e
            Excel na próxima fase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 justify-start"
            onClick={() => handleImport('csv')}
          >
            <Upload className="mr-2 size-4" />
            Importar CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 justify-start"
            onClick={() => handleImport('excel')}
          >
            <Upload className="mr-2 size-4" />
            Importar Excel
          </Button>
        </div>
        <DialogFooter>
          <p className="text-muted-foreground w-full text-xs">
            Auto-save e validação de colunas serão habilitados com a API.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
