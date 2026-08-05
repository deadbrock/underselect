'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface AdminModulePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const AdminModulePagination = memo(function AdminModulePagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  className,
}: AdminModulePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn(
        'flex flex-col items-center justify-between gap-3 sm:flex-row',
        className,
      )}
      aria-label="Paginação"
    >
      <p className="text-muted-foreground text-sm">
        {totalItems} registro{totalItems !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm tabular-nums">
          {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
});
