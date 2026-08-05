'use client';

import { Plus, Search } from 'lucide-react';
import { memo } from 'react';

import { Button, Input } from '@presentation/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';

export interface AdminModuleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onNew: () => void;
  singularLabel: string;
}

export const AdminModuleToolbar = memo(function AdminModuleToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNew,
  singularLabel,
}: AdminModuleToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
            aria-label="Buscar registros"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger
            className="h-10 w-full sm:w-40"
            aria-label="Filtrar status"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        className="min-h-10 w-full sm:w-auto"
        onClick={onNew}
      >
        <Plus className="mr-2 size-4" aria-hidden />
        Novo {singularLabel}
      </Button>
    </div>
  );
});
