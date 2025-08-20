"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Table,
  TableCell,
  TableHead,
  TableRow 
} from "./table";
import { 
  AccessibilityProps, 
  ARIA_LABELS,
  createKeyboardHandlers,
  generateAriaId,
  srOnly
} from "@/lib/accessibility";

export interface AccessibleTableProps 
  extends Omit<React.ComponentProps<typeof Table>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Caption for the table
   */
  caption?: string;
  /**
   * Description of the table content
   */
  description?: string;
  /**
   * Whether the table is sortable
   */
  sortable?: boolean;
  /**
   * Whether the table has selectable rows
   */
  selectable?: boolean;

  /**
   * Total number of rows
   */
  totalRows?: number;
  /**
   * Number of visible rows
   */
  visibleRows?: number;
  /**
   * Current page number
   */
  currentPage?: number;
  /**
   * Total number of pages
   */
  totalPages?: number;
  /**
   * Whether to show loading state
   */
  isLoading?: boolean;
  /**
   * Whether to show empty state
   */
  isEmpty?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Loading state message
   */
  loadingMessage?: string;

}

export interface AccessibleTableHeaderProps 
  extends Omit<React.ComponentProps<typeof TableHead>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Column label
   */
  label: string;
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  /**
   * Current sort direction
   */
  sortDirection?: 'ascending' | 'descending' | 'none';
  /**
   * Whether the column is sorted
   */
  isSorted?: boolean;
  /**
   * Column width
   */
  width?: string | number;

  /**
   * Whether the column is hidden
   */
  hidden?: boolean;
  /**
   * Column description
   */
  description?: string;
}

export interface AccessibleTableRowProps 
  extends Omit<React.ComponentProps<typeof TableRow>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Row index (1-based)
   */
  rowIndex: number;
  /**
   * Total number of rows
   */
  totalRows: number;
  /**
   * Whether the row is selected
   */
  selected?: boolean;
  /**
   * Whether the row is expanded
   */
  expanded?: boolean;
  /**
   * Whether the row has actions
   */
  hasActions?: boolean;
  /**
   * Row description
   */
  description?: string;
  /**
   * Whether the row is loading
   */
  isLoading?: boolean;
  /**
   * Whether the row is disabled
   */
  disabled?: boolean;
}

export interface AccessibleTableCellProps 
  extends Omit<React.ComponentProps<typeof TableCell>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Cell content
   */
  children: React.ReactNode;
  /**
   * Column index (1-based)
   */
  colIndex: number;

  /**
   * Whether the cell is a header cell
   */
  isHeader?: boolean;
  /**
   * Whether the cell is sortable
   */
  sortable?: boolean;
  /**
   * Whether the cell is selectable
   */
  selectable?: boolean;
  /**
   * Whether the cell is expandable
   */
  expandable?: boolean;
  /**
   * Cell description
   */
  description?: string;
}

export const AccessibleTable = forwardRef<
  HTMLTableElement,
  AccessibleTableProps
>(({
  children,
  className,
  caption,
  description,
  sortable = false,
  selectable = false,

  totalRows = 0,
  visibleRows = 0,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  loadingMessage = "Loading data",

  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const tableId = React.useMemo(() => generateAriaId('table'), []);
  const captionId = caption ? generateAriaId('table', 'caption') : undefined;
  const descriptionId = description ? generateAriaId('table', 'description') : undefined;
  const statusId = generateAriaId('table', 'status');

  // Build ARIA attributes
  const ariaAttributes: AccessibilityProps = {
    id: tableId,
    role: 'table',
    'aria-label': ARIA_LABELS.TABLE,
    ...(caption && {
      'aria-labelledby': captionId,
    }),
    ...(description && {
      'aria-describedby': descriptionId,
    }),
    ...(sortable && {
      'aria-sort': 'none',
    }),
    ...(selectable && {
      'aria-multiselectable': true,
    }),
  };

  // Enhanced keyboard handlers for table navigation
  const enhancedKeyboardHandlers = React.useMemo(() => {
    return createKeyboardHandlers.navigation((direction) => {
      // Handle arrow key navigation between table cells
      const currentCell = document.activeElement;
      if (currentCell && currentCell.tagName === 'TD') {
        const currentRow = currentCell.closest('tr');
        const currentCol = (currentCell as HTMLTableCellElement).cellIndex;
        
        if (currentRow) {
          let nextCell: HTMLTableCellElement | null = null;
          
          switch (direction) {
            case 'up':
              if (currentRow.previousElementSibling) {
                const prevRow = currentRow.previousElementSibling as HTMLTableRowElement;
                nextCell = prevRow.cells[currentCol];
              }
              break;
            case 'down':
              if (currentRow.nextElementSibling) {
                const nextRow = currentRow.nextElementSibling as HTMLTableRowElement;
                nextCell = nextRow.cells[currentCol];
              }
              break;
            case 'left':
              if (currentCol > 0) {
                nextCell = currentRow.cells[currentCol - 1];
              }
              break;
            case 'right':
              if (currentCol < currentRow.cells.length - 1) {
                nextCell = currentRow.cells[currentCol + 1];
              }
              break;
          }
          
          if (nextCell) {
            nextCell.focus();
          }
        }
      }
    });
  }, []);

  // Status announcement for screen readers
  const statusText = React.useMemo(() => {
    if (isLoading) return loadingMessage;
    if (isEmpty) return emptyMessage;
    return `${visibleRows} of ${totalRows} rows shown, page ${currentPage} of ${totalPages}`;
  }, [isLoading, isEmpty, visibleRows, totalRows, currentPage, totalPages, loadingMessage, emptyMessage]);

  return (
    <div className="space-y-4">
      {/* Caption */}
      {caption && (
        <caption id={captionId} className="text-lg font-semibold text-left mb-2">
          {caption}
        </caption>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Table */}
      <div className="relative">
        <Table
          ref={ref}
          className={cn(className)}
          {...ariaAttributes}
          {...enhancedKeyboardHandlers}
          {...props}
        >
          {children}
        </Table>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Status announcement for screen readers */}
      <div
        id={statusId}
        aria-live="polite"
        aria-atomic="true"
        className={srOnly}
      >
        {statusText}
      </div>
    </div>
  );
});

export const AccessibleTableHeader = forwardRef<
  HTMLTableCellElement,
  AccessibleTableHeaderProps
>(({
  children,
  className,
  label,
  sortable = false,
  sortDirection = 'none',
  isSorted = false,
  width,

  hidden = false,
  description,
  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const headerId = React.useMemo(() => generateAriaId('header'), []);
  const descriptionId = description ? generateAriaId('header', 'description') : undefined;

  // Build ARIA attributes
  const ariaAttributes: AccessibilityProps = {
    id: headerId,
    role: 'columnheader',
    'aria-label': label,
    ...(description && {
      'aria-describedby': descriptionId,
    }),
    ...(sortable && {
      'aria-sort': sortDirection,
      tabIndex: 0,
    }),
    ...(hidden && {
      'aria-hidden': true,
    }),
  };

  // Enhanced keyboard handlers for sortable headers
  const enhancedKeyboardHandlers = React.useMemo(() => {
    if (!sortable) return {};
    
    return createKeyboardHandlers.clickable(() => {
      // Handle sorting logic here
      console.log('Sort column:', label);
    });
  }, [sortable, label]);

  return (
    <>
      {/* Hidden description for screen readers */}
      {description && (
        <span id={descriptionId} className={srOnly}>
          {description}
        </span>
      )}

      <TableHead
        ref={ref}
        className={cn(
          className,
          sortable && "cursor-pointer hover:bg-accent/50",
          isSorted && "bg-accent/50"
        )}
        style={width ? { width } : undefined}
        {...ariaAttributes}
        {...enhancedKeyboardHandlers}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span>{children}</span>
          {sortable && (
            <div className="ml-2">
              {sortDirection === 'ascending' && (
                <span className="sr-only">Sorted ascending</span>
              )}
              {sortDirection === 'descending' && (
                <span className="sr-only">Sorted descending</span>
              )}
              {sortDirection === 'none' && (
                <span className="sr-only">Not sorted</span>
              )}
            </div>
          )}
        </div>
      </TableHead>
    </>
  );
});

export const AccessibleTableRow = forwardRef<
  HTMLTableRowElement,
  AccessibleTableRowProps
>(({
  children,
  className,
  rowIndex,
  totalRows,
  selected = false,
  expanded = false,
  hasActions = false,
  description,
  isLoading = false,
  disabled = false,
  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const rowId = React.useMemo(() => generateAriaId('row'), []);
  const descriptionId = description ? generateAriaId('row', 'description') : undefined;

  // Build ARIA attributes
  const ariaAttributes: AccessibilityProps = {
    id: rowId,
    role: 'row',
    'aria-rowindex': rowIndex,
    'aria-setsize': totalRows,
    ...(description && {
      'aria-describedby': descriptionId,
    }),
    ...(selected !== undefined && {
      'aria-selected': selected,
    }),
    ...(expanded !== undefined && {
      'aria-expanded': expanded,
    }),
    ...(hasActions && {
      'aria-haspopup': true,
    }),
    ...(isLoading && {
      'aria-busy': true,
    }),
    ...(disabled && {
      'aria-disabled': true,
    }),
  };

  return (
    <>
      {/* Hidden description for screen readers */}
      {description && (
        <span id={descriptionId} className={srOnly}>
          {description}
        </span>
      )}

      <TableRow
        ref={ref}
        className={cn(
          className,
          selected && "bg-accent/50",
          expanded && "bg-accent/25",
          isLoading && "opacity-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        data-state={selected ? "selected" : undefined}
        {...ariaAttributes}
        {...props}
      >
        {children}
      </TableRow>
    </>
  );
});

export const AccessibleTableCell = forwardRef<
  HTMLTableCellElement,
  AccessibleTableCellProps
>(({
  children,
  className,
  colIndex,
  isHeader = false,
  sortable = false,
  selectable = false,
  expandable = false,
  description,
  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const cellId = React.useMemo(() => generateAriaId('cell'), []);
  const descriptionId = description ? generateAriaId('cell', 'description') : undefined;

  // Build ARIA attributes
  const ariaAttributes: AccessibilityProps = {
    id: cellId,
    role: isHeader ? 'columnheader' : 'cell',
    'aria-colindex': colIndex,
    'aria-colspan': 1,
    ...(description && {
      'aria-describedby': descriptionId,
    }),
    ...(sortable && {
      'aria-sort': 'none',
    }),
    ...(selectable && {
      'aria-selected': false,
    }),
    ...(expandable && {
      'aria-expanded': false,
    }),
  };

  return (
    <>
      {/* Hidden description for screen readers */}
      {description && (
        <span id={descriptionId} className={srOnly}>
          {description}
        </span>
      )}

      <TableCell
        ref={ref}
        className={cn(
          className,
          sortable && "cursor-pointer hover:bg-accent/50",
          selectable && "cursor-pointer",
          expandable && "cursor-pointer"
        )}
        {...ariaAttributes}
        {...props}
      >
        {children}
      </TableCell>
    </>
  );
});

AccessibleTable.displayName = "AccessibleTable";
AccessibleTableHeader.displayName = "AccessibleTableHeader";
AccessibleTableRow.displayName = "AccessibleTableRow";
AccessibleTableCell.displayName = "AccessibleTableCell"; 