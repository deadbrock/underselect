'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';

export interface AdminModuleActionsProps {
  itemName: string;
  singularLabel: string;
}

export const AdminModuleActions = memo(function AdminModuleActions({
  itemName,
  singularLabel,
}: AdminModuleActionsProps) {
  const handleAction = (action: string) => {
    toast.info(
      `${action} ${singularLabel} "${itemName}" — integração futura preparada.`,
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Visualizar ${itemName}`}
        onClick={() => handleAction('Visualizar')}
      >
        <Eye className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Editar ${itemName}`}
        onClick={() => handleAction('Editar')}
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Excluir ${itemName}`}
        onClick={() => handleAction('Excluir')}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
});
