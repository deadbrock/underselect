'use client';

import { memo } from 'react';

import { PageHeader } from '@presentation/components/layout/page-header';
import { cn } from '@shared/utils/cn';

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const DashboardHeader = memo(function DashboardHeader({
  title,
  description,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        'border-border bg-background/95 border-b backdrop-blur',
        className,
      )}
    >
      <div className="px-4 py-4 md:px-6 lg:px-8">
        <PageHeader title={title} description={description} actions={actions} />
      </div>
    </div>
  );
});

export { DashboardHeader };
