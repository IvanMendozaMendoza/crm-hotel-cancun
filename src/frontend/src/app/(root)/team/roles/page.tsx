"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users, Search, Filter, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CreateRoleGroupDialog } from "@/components/create-role-group-dialog";
import { EditRoleGroupDialog } from "@/components/edit-role-group-dialog";
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
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Permission categories and their permissions
const permissionCategories = {
  "User Management": [
    "view_users",
    "create_users", 
    "edit_users",
    "delete_users",
    "assign_roles"
  ],
  "Content Management": [
    "view_content",
    "create_content",
    "edit_content", 
    "delete_content",
    "publish_content"
  ],
  "System Administration": [
    "view_settings",
    "edit_settings",
    "view_logs",
    "manage_backups",
    "system_maintenance"
  ],
  "Data Management": [
    "view_data",
    "export_data",
    "import_data",
    "delete_data",
    "anonymize_data"
  ],
  "Analytics & Reports": [
    "view_analytics",
    "create_reports",
    "export_reports",
    "share_reports"
  ],
  "Security": [
    "view_security",
    "manage_permissions",
    "audit_logs",
    "security_settings"
  ]
};

// Sample role groups data
const initialRoleGroups = [
  {
    id: "1",
    name: "Administrators",
    description: "Full system access with all permissions",
    permissions: Object.values(permissionCategories).flat(),
    userCount: 3,
    createdAt: "2024-01-15"
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
      "view_analytics"
    ],
    userCount: 8,
    createdAt: "2024-01-20"
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
      "share_reports"
    ],
    userCount: 5,
    createdAt: "2024-01-25"
  },
  {
    id: "4",
    name: "Viewers",
    description: "Read-only access to basic content",
    permissions: [
      "view_users",
      "view_content",
      "view_analytics"
    ],
    userCount: 12,
    createdAt: "2024-02-01"
  },
  {
    id: "5",
    name: "Moderators",
    description: "Moderate user content and manage reports",
    permissions: [
      "view_users",
      "view_content",
      "edit_content",
      "delete_content",
      "view_analytics",
      "create_reports"
    ],
    userCount: 6,
    createdAt: "2024-02-05"
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
      "export_data"
    ],
    userCount: 4,
    createdAt: "2024-02-10"
  }
];

// Helper functions
const getPermissionLabel = (permission: string) => {
  const labels: { [key: string]: string } = {
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
    security_settings: "Security Settings"
  };
  return labels[permission] || permission;
};

const handleUpdateRoleGroup = (roleGroupName: string) => {
  toast.success(`"${roleGroupName}" details updated`);
};

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function DraggableRow({ row }: { row: Row<typeof initialRoleGroups[0]> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

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
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}



// Define columns for the table
const columns: ColumnDef<typeof initialRoleGroups[0]>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Role name",
    cell: ({ row }) => {
      const roleGroup = row.original;
      return (
        <div>
          <div className="font-medium text-white">{roleGroup.name}</div>
          <div className="text-sm text-gray-400">{roleGroup.description}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const roleGroup = row.original;
      const [open, setOpen] = useState(false);
      const [searchValue, setSearchValue] = useState("");
      
      // Get all available permissions
      const allPermissions = Object.values(permissionCategories).flat();
      
      // Filter permissions based on search
      const filteredPermissions = allPermissions.filter(permission =>
        getPermissionLabel(permission).toLowerCase().includes(searchValue.toLowerCase())
      );
      
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-stone-900 border-gray-700 text-white hover:bg-stone-800"
            >
              <span className="truncate">
                {roleGroup.permissions.length} permissions
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                      <div className={`w-2 h-2 rounded-full ${
                        roleGroup.permissions.includes(permission) 
                          ? "bg-blue-400" 
                          : "bg-gray-500"
                      }`} />
                      {getPermissionLabel(permission)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    },
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
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span className="text-gray-300">{row.original.createdAt}</span>,
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
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-gray-700"
              onClick={() => handleUpdateRoleGroup(roleGroup.name)}
            >
              Edit role
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
              Delete role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const TeamRolesPage = () => {
  const [roleGroups, setRoleGroups] = useState(initialRoleGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoleGroup, setEditingRoleGroup] = useState<any>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => roleGroups?.map(({ id }) => id) || [],
    [roleGroups]
  );

  // Filter role groups based on search and category
  const filteredRoleGroups = roleGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           group.permissions.some(perm => 
                             Object.values(permissionCategories[selectedCategory as keyof typeof permissionCategories] || []).includes(perm)
                           );
    return matchesSearch && matchesCategory;
  });

  // Create table instance
  const table = useReactTable({
    data: filteredRoleGroups,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setRoleGroups((roleGroups) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(roleGroups, oldIndex, newIndex)
      })
    }
  }

  const handleCreateRoleGroup = (data: any) => {
    console.log("handleCreateRoleGroup called with:", data);
    if (!data.name.trim()) {
      toast.error("Role group name is required");
      return;
    }
    if (data.permissions.length === 0) {
      toast.error("At least one permission is required");
      return;
    }

    const newRoleGroup = {
      id: Date.now().toString(),
      ...data,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log("Creating new role group:", newRoleGroup);
    setRoleGroups(prev => [...prev, newRoleGroup]);
    setIsCreateDialogOpen(false);
    toast.success("Role group created successfully");
  };

  const handleEditRoleGroup = (data: any) => {
    console.log("handleEditRoleGroup called with:", data);
    if (!data.name.trim()) {
      toast.error("Role group name is required");
      return;
    }
    if (data.permissions.length === 0) {
      toast.error("At least one permission is required");
      return;
    }

    console.log("Updating role group:", editingRoleGroup?.id, "with data:", data);
    setRoleGroups(prev => prev.map(group => 
      group.id === editingRoleGroup.id 
        ? { ...group, ...data }
        : group
    ));
    
    setIsEditDialogOpen(false);
    setEditingRoleGroup(null);
    toast.success("Role group updated successfully");
  };

  const handleDeleteRoleGroup = (id: string) => {
    const group = roleGroups.find(g => g.id === id);
    if (group && group.userCount > 0) {
      toast.error("Cannot delete role group with assigned users");
      return;
    }
    
    setRoleGroups(prev => prev.filter(group => group.id !== id));
    toast.success("Role group deleted successfully");
  };

  const openEditDialog = (roleGroup: any) => {
    setEditingRoleGroup(roleGroup);
    setIsEditDialogOpen(true);
  };



  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">User Roles {roleGroups.length}</h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                type="search"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 w-full sm:w-64"
              />
            </div>
            
            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-gray-700 w-56">
                <DropdownMenuLabel className="text-gray-300">Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedCategory === "all" ? "bg-gray-800/50" : ""}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </DropdownMenuItem>
                {Object.keys(permissionCategories).map(category => (
                  <DropdownMenuItem 
                    key={category}
                    className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedCategory === category ? "bg-gray-800/50" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Add Role Group */}
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-black text-white hover:bg-gray-900">
              <Plus className="h-4 w-4 mr-2" />
              Add role group
            </Button>
            
            <CreateRoleGroupDialog 
              open={isCreateDialogOpen} 
              onOpenChange={setIsCreateDialogOpen}
              onSubmit={handleCreateRoleGroup}
            />
          </div>
        </div>

                {/* Table View */}
        <div className="overflow-hidden rounded-lg border border-gray-700">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-stone-900">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-gray-700">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-300 font-medium">
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
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      No role groups found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Edit Dialog */}
        <EditRoleGroupDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          roleGroup={editingRoleGroup}
          onSubmit={handleEditRoleGroup}
        />

        {/* Pagination */}
        {filteredRoleGroups.length > 0 && (
          <div className="flex items-center justify-between px-4 mt-6">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredRowModel().rows.length} role group(s) total.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium text-gray-300">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger size="sm" className="w-20 bg-stone-900 border-gray-700 text-gray-300" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top" className="bg-stone-900 border-gray-700">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`} className="text-gray-300">
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
                  className="hidden h-8 w-8 p-0 lg:flex bg-stone-900 border-gray-700 text-gray-300 hover:bg-stone-800"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 bg-stone-900 border-gray-700 text-gray-300 hover:bg-stone-800"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 bg-stone-900 border-gray-700 text-gray-300 hover:bg-stone-800"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex bg-stone-900 border-gray-700 text-gray-300 hover:bg-stone-800"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRolesPage;
