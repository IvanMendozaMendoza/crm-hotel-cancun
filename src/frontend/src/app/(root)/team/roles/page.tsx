"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Users,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
} from "@tanstack/react-table";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const permissionCategories: Record<string, string[]> = {
  "User Management": [
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "assign_roles",
  ],
  "Content Management": [
    "view_content",
    "create_content",
    "edit_content",
    "delete_content",
    "publish_content",
  ],
  "System Administration": [
    "view_settings",
    "edit_settings",
    "view_logs",
    "manage_backups",
    "system_maintenance",
  ],
  "Data Management": [
    "view_data",
    "export_data",
    "import_data",
    "delete_data",
    "anonymize_data",
  ],
  "Analytics & Reports": [
    "view_analytics",
    "create_reports",
    "export_reports",
    "share_reports",
  ],
  Security: [
    "view_security",
    "manage_permissions",
    "audit_logs",
    "security_settings",
  ],
};

const initialRoleGroups = [
  {
    id: "1",
    name: "Administrators",
    description: "Full system access with all permissions",
    permissions: Object.values(permissionCategories).flat(),
    userCount: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Content Managers",
    description: "Manage content and moderate user-generated content",
    permissions: [
      "view_users",
      "view_content",
      "create_content",
      "edit_content",
      "delete_content",
      "publish_content",
      "view_analytics",
    ],
    userCount: 8,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Data Analysts",
    description: "Access to analytics and reporting features",
    permissions: [
      "view_data",
      "export_data",
      "view_analytics",
      "create_reports",
      "export_reports",
      "share_reports",
    ],
    userCount: 5,
    createdAt: "2024-01-25",
  },
  {
    id: "42",
    name: "Viewers",
    description: "Read-only access to basic content",
    permissions: ["view_users", "view_content", "view_analytics"],
    userCount: 12,
    createdAt: "2024-02-01",
  },
  {
    id: "565",
    name: "Moderators",
    description: "Moderate user content and manage reports",
    permissions: [
      "view_users",
      "view_content",
      "edit_content",
      "delete_content",
      "view_analytics",
      "create_reports",
    ],
    userCount: 6,
    createdAt: "2024-02-05",
  },
  {
    id: "654",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "6433",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "621",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "2121",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "99",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "19",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "8",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
  {
    id: "6",
    name: "Developers",
    description: "Technical access for development and debugging",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "system_maintenance",
      "view_data",
      "export_data",
    ],
    userCount: 4,
    createdAt: "2024-02-10",
  },
];

const permissionLabels: { [key: string]: string } = {
  view_users: "View Users",
  create_users: "Create Users",
  edit_users: "Edit Users",
  delete_users: "Delete Users",
  assign_roles: "Assign Roles",
  view_content: "View Content",
  create_content: "Create Content",
  edit_content: "Edit Content",
  delete_content: "Delete Content",
  publish_content: "Publish Content",
  view_settings: "View Settings",
  edit_settings: "Edit Settings",
  view_logs: "View Logs",
  manage_backups: "Manage Backups",
  system_maintenance: "System Maintenance",
  view_data: "View Data",
  export_data: "Export Data",
  import_data: "Import Data",
  delete_data: "Delete Data",
  anonymize_data: "Anonymize Data",
  view_analytics: "View Analytics",
  create_reports: "Create Reports",
  export_reports: "Export Reports",
  share_reports: "Share Reports",
  view_security: "View Security",
  manage_permissions: "Manage Permissions",
  audit_logs: "Audit Logs",
  security_settings: "Security Settings",
};

const getPermissionLabel = (permission: string) =>
  permissionLabels[permission] || permission;

const PermissionPopover = ({
  roleGroup,
}: {
  roleGroup: { permissions: string[] };
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const allPermissions = Object.values(permissionCategories).flat();
  const filteredPermissions = allPermissions.filter((permission) =>
    getPermissionLabel(permission)
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className="-ml-6"
        >
          <span className="truncate">
            {roleGroup.permissions.length} permissions
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-stone-900 border-gray-700">
        <Command>
          <CommandInput
            placeholder="Search permissions..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-gray-700"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No permissions found.</CommandEmpty>
            <CommandGroup>
              {filteredPermissions.map((permission) => (
                <CommandItem
                  key={permission}
                  className={`flex items-center gap-2 ${
                    roleGroup.permissions.includes(permission)
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      roleGroup.permissions.includes(permission)
                        ? "bg-blue-400"
                        : "bg-gray-500"
                    }`}
                  />
                  {getPermissionLabel(permission)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search"
        type="search"
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 w-full sm:w-64"
      />
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-zinc-900 border-gray-700 w-56"
      >
        <DropdownMenuLabel className="text-gray-300">
          Filter by Category
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          className={`text-gray-300 hover:text-black hover:bg-stone-300 ${
            selectedCategory === "all" ? "bg-gray-800/50" : ""
          }`}
          onClick={() => onCategoryChange("all")}
        >
          All Categories
        </DropdownMenuItem>
        {Object.keys(permissionCategories).map((category) => (
          <DropdownMenuItem
            key={category}
            className={`text-gray-300 hover:text-black hover:bg-stone-300 ${
              selectedCategory === category ? "bg-gray-800/50" : ""
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const Pagination = ({
  table,
}: {
  table: ReturnType<typeof useReactTable<(typeof initialRoleGroups)[0]>>;
}) => (
  <div className="flex items-center justify-between px-4 mt-6">
    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
      {table.getFilteredRowModel().rows.length} role group(s) total.
    </div>
    <div className="flex w-full items-center gap-8 lg:w-fit">
      <div className="hidden items-center gap-2 lg:flex">
        <Label
          htmlFor="rows-per-page"
          className="text-sm font-medium text-gray-300"
        >
          Rows per page
        </Label>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-20 bg-stone-900 border-gray-700 text-gray-300"
            id="rows-per-page"
          >
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="bg-stone-900 border-gray-700">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                className="text-gray-300"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-fit items-center justify-center text-sm font-medium text-gray-300">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

function DraggableRow({ row }: { row: Row<(typeof initialRoleGroups)[0]> }) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    setActivatorNodeRef,
  } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 border-gray-700 hover:bg-gray-800/30"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag" ? (
            <Button
              ref={(node: HTMLButtonElement | null) =>
                setActivatorNodeRef(node)
              }
              {...attributes}
              {...listeners}
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-7 hover:bg-transparent"
            >
              <GripVertical className="text-muted-foreground size-3" />
              <span className="sr-only">Drag to reorder</span>
            </Button>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

const TeamRolesPage = () => {
  const router = useRouter();
  const [roleGroups, setRoleGroups] = useState(initialRoleGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const handleCreateRoleGroup = useCallback(() => {
    router.push("/team/roles/create");
  }, [router]);

  const handleDeleteRoleGroup = useCallback(
    (id: string) => {
      const group = roleGroups.find((g) => g.id === id);
      if (group && group.userCount > 0) {
        toast.error("Cannot delete role group with assigned users");
        return;
      }

      setRoleGroups((prev) => prev.filter((group) => group.id !== id));
      toast.success("Role group deleted successfully");
    },
    [roleGroups]
  );

  const columns = useMemo<ColumnDef<(typeof initialRoleGroups)[0]>[]>(
    () => [
      {
        id: "drag",
        header: () => null,
        cell: () => null,
        size: 40,
      },
      {
        accessorKey: "name",
        header: "Role name",
        cell: ({ row }) => {
          const roleGroup = row.original;
          return (
            <div className="min-w-0">
              <div className="font-medium text-white truncate">
                {roleGroup.name}
              </div>
              <div className="text-sm text-gray-400 truncate">
                {roleGroup.description}
              </div>
            </div>
          );
        },
        size: 280,
      },
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => <PermissionPopover roleGroup={row.original} />,
        size: 140,
      },
      {
        accessorKey: "userCount",
        header: "Users",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">{row.original.userCount}</span>
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-gray-300">{row.original.createdAt}</span>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const roleGroup = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-800 border-gray-700"
              >
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-700"
                  onClick={() => handleDeleteRoleGroup(roleGroup.id)}
                >
                  Delete role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 50,
      },
    ],
    [handleDeleteRoleGroup]
  );

  const table = useReactTable({
    data: roleGroups,
    columns,
    filterFns: {
      permissions: (row, id, filterValue) => {
        const permissions = row.getValue(id) as string[];
        const permissionCategory =
          permissionCategories[
            filterValue as keyof typeof permissionCategories
          ] || [];
        return permissionCategory.some((p: string) => permissions.includes(p));
      },
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  });

  useEffect(() => {
    table.setGlobalFilter(searchTerm);
  }, [searchTerm, table]);

  useEffect(() => {
    if (selectedCategory === "all") {
      table.resetColumnFilters();
      return;
    }
    table.setColumnFilters([
      {
        id: "permissions",
        value: selectedCategory,
      },
    ]);
  }, [selectedCategory, table]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setRoleGroups((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            User Roles {roleGroups.length}
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <Button
              onClick={handleCreateRoleGroup}
              className="bg-black text-white hover:bg-gray-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add role group
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-700">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-stone-900">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-gray-700">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-300 font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={table.getRowModel().rows.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-400"
                    >
                      No role groups found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {table.getRowModel().rows.length > 0 && <Pagination table={table} />}
      </div>
    </div>
  );
};

export default TeamRolesPage;
