import { z } from "zod";
import type { Table } from "@tanstack/react-table";

export const dataTableSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type DataTableItem = z.infer<typeof dataTableSchema>;

export interface DataTableProps {
  data: DataTableItem[];
  onDataChange?: (data: DataTableItem[]) => void;
}

export interface TableCellViewerProps {
  item: DataTableItem;
}

export interface TableFiltersProps {
  table: Table<DataTableItem>;
}

export interface TablePaginationProps {
  table: Table<DataTableItem>;
}

export interface TableToolbarProps {
  table: Table<DataTableItem>;
} 