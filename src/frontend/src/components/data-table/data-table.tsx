"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import { toast } from "sonner";
import { useDataTable } from "@/hooks/use-data-table";
import { createTableColumns } from "./table-columns";
import { TableToolbar } from "./table-toolbar";
import { TablePagination } from "./table-pagination";
import { ErrorBoundary } from "@/components/error-boundary";
import { TableSkeleton, LoadingSpinner } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableProps, DataTableItem } from "@/types/data-table";

interface DataTableContentProps extends DataTableProps {
  isLoading?: boolean;
  error?: Error | null;
}

const DataTableContent = ({ data, onDataChange, isLoading, error }: DataTableContentProps) => {
  const [items, setItems] = useState<DataTableItem[]>(data);
  const columns = createTableColumns();
  const { table } = useDataTable(items, columns);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        onDataChange?.(newItems);
        return newItems;
      });

      toast.success("Items reordered successfully");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">Loading table data...</span>
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <TableSkeleton rows={8} columns={8} />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">Failed to load data</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "Something went wrong while loading the table data."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <TableToolbar table={table} />
      </div>
      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <TablePagination table={table} />
      </div>
    </div>
  );
};

export const DataTable = (props: DataTableProps & { isLoading?: boolean; error?: Error | null }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Table Error</h3>
          <p className="text-muted-foreground mb-4">
            Something went wrong while loading the table. Please refresh the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error("DataTable error:", error, errorInfo);
        // Here you would typically send to your error monitoring service
      }}
    >
      <DataTableContent {...props} />
    </ErrorBoundary>
  );
}; 