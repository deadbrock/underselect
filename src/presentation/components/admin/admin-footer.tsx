import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export const AdminFooter = memo(function AdminFooter() {
  return (
    <footer
      className={cn(
        'border-border text-muted-foreground border-t px-4 py-4 text-xs md:px-6 lg:px-8',
      )}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} UNDER SELECT — Painel Administrativo</p>
        <p>Estrutura preparada para integração com APIs e banco de dados.</p>
      </div>
    </footer>
  );
});
