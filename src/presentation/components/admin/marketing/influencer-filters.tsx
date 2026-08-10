'use client';

import { memo } from 'react';

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import {
  ADMIN_INFLUENCER_STATUS_LABELS,
  INFLUENCER_CHANNEL_LABELS,
} from '@shared/constants/marketing-admin.constants';
import type { InfluencerFilters } from '@shared/types/marketing-admin.types';
import { cn } from '@shared/utils/cn';

export interface InfluencerFiltersPanelProps {
  filters: InfluencerFilters;
  onChange: <K extends keyof InfluencerFilters>(
    key: K,
    value: InfluencerFilters[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export const InfluencerFiltersPanel = memo(function InfluencerFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: InfluencerFiltersPanelProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filtros</span>
        <button
          type="button"
          className="text-label text-brand-bronze text-xs hover:underline"
          onClick={onReset}
        >
          Limpar
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => onChange('status', v)}
          >
            <SelectTrigger aria-label="Filtrar status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(ADMIN_INFLUENCER_STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Canal</Label>
          <Select
            value={filters.channel}
            onValueChange={(v) => onChange('channel', v)}
          >
            <SelectTrigger aria-label="Filtrar canal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(INFLUENCER_CHANNEL_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
});
