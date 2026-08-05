import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Table = memo(
  forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    ),
  ),
);
Table.displayName = 'Table';

const TableHeader = memo(
  forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )),
);
TableHeader.displayName = 'TableHeader';

const TableBody = memo(
  forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )),
);
TableBody.displayName = 'TableBody';

const TableFooter = memo(
  forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  )),
);
TableFooter.displayName = 'TableFooter';

const TableRow = memo(
  forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
      <tr
        ref={ref}
        className={cn(
          'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
          className,
        )}
        {...props}
      />
    ),
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = memo(
  forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
  >(({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'text-label text-muted-foreground h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )),
);
TableHead.displayName = 'TableHead';

const TableCell = memo(
  forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
  >(({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )),
);
TableCell.displayName = 'TableCell';

const TableCaption = memo(
  forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
  >(({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  )),
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
