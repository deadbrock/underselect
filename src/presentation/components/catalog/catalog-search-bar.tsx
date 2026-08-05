'use client';

import { Search, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import { Input } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface CatalogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const CatalogSearchBar = memo(function CatalogSearchBar({
  value,
  onChange,
  placeholder = 'Buscar por nome, time, seleção, marca…',
  className,
  debounceMs = 300,
}: CatalogSearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local, value, onChange, debounceMs]);

  const clear = useCallback(() => {
    setLocal('');
    onChange('');
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search
        className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-11 pr-10 pl-10"
        aria-label="Buscar produtos"
      />
      {local && (
        <button
          type="button"
          onClick={clear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          aria-label="Limpar busca"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});
