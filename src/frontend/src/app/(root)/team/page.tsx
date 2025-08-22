"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MoreVertical,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
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
  ColumnFiltersState,
} from "@tanstack/react-table";

const sampleUsers = [
  {
    id: "1",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: "Admin",
    status: "active",
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "2",
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    avatar: "/avatars/amelie.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "3",
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    avatar: "/avatars/ammar.jpg",
    access: "User",
    status: "disabled",
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "4",
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    avatar: "/avatars/caitlyn.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 8, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "5",
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    avatar: "/avatars/sienna.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 1, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "6",
    name: "Olly Shroeder",
    email: "olly@untitledui.com",
    avatar: "/avatars/olly.jpg",
    access: "User",
    status: "disabled",
    lastActive: "Mar 3, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "7",
    name: "Mathilde Lewis",
    email: "mathilde@untitledui.com",
    avatar: "/avatars/mathilde.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 5, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "8",
    name: "Jaya Willis",
    email: "jaya@untitledui.com",
    avatar: "/avatars/jaya.jpg",
    access: "Admin",
    status: "active",
    lastActive: "Mar 7, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "9",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/default-1.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 10, 2024",
    dateAdded: "July 5, 2022",
  },
  {
    id: "10",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/default-2.jpg",
    access: "User",
    status: "disabled",
    lastActive: "Mar 9, 2024",
    dateAdded: "July 6, 2022",
  },
  {
    id: "11",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    avatar: "/avatars/default-3.jpg",
    access: "Admin",
    status: "active",
    lastActive: "Mar 11, 2024",
    dateAdded: "July 7, 2022",
  },
  {
    id: "12",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/avatars/default-4.jpg",
    access: "User",
    status: "active",
    lastActive: "Mar 12, 2024",
    dateAdded: "July 8, 2022",
  },
];

type User = (typeof sampleUsers)[0];

const accessCategories = {
  Admin: ["Admin"],
  "Data Export": ["Data Export"],
  "Data Import": ["Data Import"],
  "Full Access": ["Admin", "Data Export", "Data Import"],
  "Limited Access": ["Data Export", "Data Import"],
};

const sortOptions = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "email_asc", label: "Email (A-Z)" },
  { value: "email_desc", label: "Email (Z-A)" },
  { value: "lastActive_desc", label: "Last Active (Newest)" },
  { value: "lastActive_asc", label: "Last Active (Oldest)" },
  { value: "dateAdded_desc", label: "Date Added (Newest)" },
  { value: "dateAdded_asc", label: "Date Added (Oldest)" },
];

const UserAvatar = ({ user }: { user: User }) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className="bg-gray-700 text-white">
        {user.name[0]}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium text-white">{user.name}</div>
      <div className="text-sm text-gray-400">{user.email}</div>
    </div>
  </div>
);

const AccessBadge = ({ user }: { user: User }) => {
  const isCurrentUser = user.id === "1";
  const isDisabled = user.status === "disabled";

  return (
    <Badge
      variant="outline"
      className={`${
        isCurrentUser
          ? "bg-green-500/20 text-green-400 border-green-500/30"
          : isDisabled
          ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
      } border`}
    >
      {user.access}
    </Badge>
  );
};

const UserActions = ({
  user,
  onUpdateUser,
}: {
  user: User;
  onUpdateUser: (name: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
      <DropdownMenuItem
        className="text-gray-300 hover:bg-gray-700"
        onClick={() => onUpdateUser(user.name)}
      >
        Edit user
      </DropdownMenuItem>
      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
        View profile
      </DropdownMenuItem>
      <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
        Delete user
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedAccessFilter,
  onAccessFilterChange,
  selectedSort,
  onSortChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAccessFilter: string;
  onAccessFilterChange: (filter: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
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
          Filter by Access Level
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          className={`text-gray-300 hover:text-black hover:bg-stone-300 ${
            selectedAccessFilter === "all" ? "bg-gray-800/50" : ""
          }`}
          onClick={() => onAccessFilterChange("all")}
        >
          All Access Levels
        </DropdownMenuItem>
        {Object.keys(accessCategories).map((accessLevel) => (
          <DropdownMenuItem
            key={accessLevel}
            className={`text-gray-300 hover:text-black hover:bg-stone-300 ${
              selectedAccessFilter === accessLevel ? "bg-gray-800/50" : ""
            }`}
            onClick={() => onAccessFilterChange(accessLevel)}
          >
            {accessLevel}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuLabel className="text-gray-300">Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        {sortOptions.map((sortOption) => (
          <DropdownMenuItem
            key={sortOption.value}
            className={`text-gray-300 hover:text-black hover:bg-stone-300 ${
              selectedSort === sortOption.value ? "bg-gray-800/50" : ""
            }`}
            onClick={() => onSortChange(sortOption.value)}
          >
            {sortOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const Pagination = ({
  table,
}: {
  table: ReturnType<typeof useReactTable<User>>;
}) => (
  <div className="flex items-center justify-between px-4 mt-6">
    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
      {table.getFilteredRowModel().rows.length} user(s) total.
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

const EmptyState = ({
  searchTerm,
  selectedAccessFilter,
  onAddUser,
}: {
  searchTerm: string;
  selectedAccessFilter: string;
  onAddUser: () => void;
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
    <p className="text-gray-400 mb-4">
      {searchTerm || selectedAccessFilter !== "all"
        ? "Try adjusting your search or filter criteria"
        : "Get started by adding your first user"}
    </p>
    {!searchTerm && selectedAccessFilter === "all" && (
      <Button onClick={onAddUser}>
        <Plus className="h-4 w-4 mr-2" />
        Add User
      </Button>
    )}
  </div>
);

const TeamPage = () => {
  const router = useRouter();
  const users = sampleUsers;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccessFilter, setSelectedAccessFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("name_asc");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedAccessFilter === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        {
          id: "access",
          value: selectedAccessFilter,
        },
      ]);
    }
  }, [selectedAccessFilter]);

  useEffect(() => {
    const [id, order] = selectedSort.split("_");
    if (id && order) {
      setSorting([{ id, desc: order === "desc" }]);
    }
  }, [selectedSort]);

  const handleUpdateUser = useCallback((userName: string) => {
    toast.success(`"${userName}" details updated`);
  }, []);

  const handleAddUser = useCallback(() => {
    router.push("/team/create");
  }, [router]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User name",
        cell: ({ row }) => <UserAvatar user={row.original} />,
      },
      {
        accessorKey: "access",
        header: "Access",
        cell: ({ row }) => <AccessBadge user={row.original} />,
      },
      {
        accessorKey: "lastActive",
        header: "Last active",
        cell: ({ row }) => (
          <span className="text-gray-300">{row.original.lastActive}</span>
        ),
      },
      {
        accessorKey: "dateAdded",
        header: "Date added",
        cell: ({ row }) => (
          <span className="text-gray-300">{row.original.dateAdded}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <span
              className={
                user.status === "active" ? "text-gray-300" : "text-gray-400"
              }
            >
              {user.status === "active" ? "Active" : "Disabled"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <UserActions user={row.original} onUpdateUser={handleUpdateUser} />
        ),
      },
    ],
    [handleUpdateUser]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            All users {users.length}
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedAccessFilter={selectedAccessFilter}
              onAccessFilterChange={setSelectedAccessFilter}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
            <Button
              onClick={handleAddUser}
              className="bg-black text-white hover:bg-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add user
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-700">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-gray-700 hover:bg-gray-800/30"
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-400"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {table.getRowModel().rows.length > 0 && <Pagination table={table} />}

        {table.getRowModel().rows.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            selectedAccessFilter={selectedAccessFilter}
            onAddUser={handleAddUser}
          />
        )}
      </div>
    </div>
  );
};

export default TeamPage;
