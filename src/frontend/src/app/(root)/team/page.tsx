"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Search, Filter, ChevronDown, Plus, X, Check, UserPlus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
} from "@tanstack/react-table";

// Hardcoded sample data
const sampleUsers = [
  {
    id: "1",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "14554",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "177",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "12",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "11",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "17",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "/avatars/florence.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "2",
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    avatar: "/avatars/amelie.jpg",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "3",
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    avatar: "/avatars/ammar.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "4",
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    avatar: "/avatars/caitlyn.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 8, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "5",
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    avatar: "/avatars/sienna.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 1, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "6",
    name: "Olly Shroeder",
    email: "olly@untitledui.com",
    avatar: "/avatars/olly.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 3, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "7",
    name: "Mathilde Lewis",
    email: "mathilde@untitledui.com",
    avatar: "/avatars/mathilde.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 5, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: "8",
    name: "Jaya Willis",
    email: "jaya@untitledui.com",
    avatar: "/avatars/jaya.jpg",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 7, 2024",
    dateAdded: "July 4, 2022",
  },
];

// Access level categories for filtering
const accessCategories = {
  "Admin": ["Admin"],
  "Data Export": ["Data Export"],
  "Data Import": ["Data Import"],
  "Full Access": ["Admin", "Data Export", "Data Import"],
  "Limited Access": ["Data Export", "Data Import"]
};

// Available access levels for new users
const availableAccessLevels = [
  { id: "admin", label: "Admin", description: "Full system access" },
  { id: "data_export", label: "Data Export", description: "Export data permissions" },
  { id: "data_import", label: "Data Import", description: "Import data permissions" }
];

// Sorting options
const sortOptions = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "email_asc", label: "Email (A-Z)" },
  { value: "email_desc", label: "Email (Z-A)" },
  { value: "lastActive_desc", label: "Last Active (Newest)" },
  { value: "lastActive_asc", label: "Last Active (Oldest)" },
  { value: "dateAdded_desc", label: "Date Added (Newest)" },
  { value: "dateAdded_asc", label: "Date Added (Oldest)" }
];

// Default avatar options
const defaultAvatars = [
  "/avatars/default-1.jpg",
  "/avatars/default-2.jpg",
  "/avatars/default-3.jpg",
  "/avatars/default-4.jpg",
  "/avatars/default-5.jpg",
  "/avatars/default-6.jpg"
];

// Helper functions
const getAccessBadgeColor = (access: string) => {
  switch (access) {
    case "Admin":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Data Export":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Data Import":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const handleUpdateUser = (userName: string) => {
  toast.success(`"${userName}" details updated`);
};

// Define columns for the table
const columns: ColumnDef<typeof sampleUsers[0]>[] = [
  {
    accessorKey: "name",
    header: "User name",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
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
    },
  },
  {
    accessorKey: "access",
    header: "Access",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-wrap gap-2">
          {user.access.map((access) => (
            <Badge
              key={access}
              variant="outline"
              className={`${getAccessBadgeColor(access)} border`}
            >
              {access}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last active",
    cell: ({ row }) => <span className="text-gray-300">{row.original.lastActive}</span>,
  },
  {
    accessorKey: "dateAdded",
    header: "Date added",
    cell: ({ row }) => <span className="text-gray-300">{row.original.dateAdded}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;
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
              onClick={() => handleUpdateUser(user.name)}
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
    },
  },
];

const TeamPage = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccessFilter, setSelectedAccessFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("name_asc");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Add user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    avatar: defaultAvatars[0],
    access: [] as string[]
  });

  // Filter users based on search and access filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccess = selectedAccessFilter === "all" || 
                         user.access.some(access => 
                           accessCategories[selectedAccessFilter as keyof typeof accessCategories]?.includes(access)
                         );
    
    return matchesSearch && matchesAccess;
  });

  // Sort users based on selected sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (selectedSort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "email_asc":
        return a.email.localeCompare(b.email);
      case "email_desc":
        return b.email.localeCompare(a.email);
      case "lastActive_desc":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case "lastActive_asc":
        return new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      case "dateAdded_desc":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case "dateAdded_asc":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      default:
        return 0;
    }
  });

  // Create table instance
  const table = useReactTable({
    data: sortedUsers,
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

  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleSubmitNewUser = () => {
    // Validation
    if (!newUser.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newUser.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!newUser.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (newUser.access.length === 0) {
      toast.error("Please select at least one access level");
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast.error("A user with this email already exists");
      return;
    }

    // Create new user
    const newUserData = {
      id: (users.length + 1).toString(),
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      avatar: newUser.avatar,
      access: newUser.access,
      lastActive: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      dateAdded: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };

    // Add to users array
    setUsers(prev => [...prev, newUserData]);
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      avatar: defaultAvatars[0],
      access: []
    });
    
    // Close dialog and show success message
    setIsAddUserDialogOpen(false);
    toast.success(`User "${newUserData.name}" added successfully`);
  };

  const handleCancelAddUser = () => {
    // Reset form
    setNewUser({
      name: "",
      email: "",
      avatar: defaultAvatars[0],
      access: []
    });
    setIsAddUserDialogOpen(false);
  };

  const toggleAccessLevel = (accessId: string) => {
    setNewUser(prev => ({
      ...prev,
      access: prev.access.includes(accessId)
        ? prev.access.filter(id => id !== accessId)
        : [...prev.access, accessId]
    }));
  };

  const getAccessLabel = (accessId: string) => {
    const access = availableAccessLevels.find(a => a.id === accessId);
    return access ? access.label : accessId;
  };



  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">All users {users.length}</h1>
          
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
                <DropdownMenuLabel className="text-gray-300">Filter by Access Level</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedAccessFilter === "all" ? "bg-gray-800/50" : ""}`}
                  onClick={() => setSelectedAccessFilter("all")}
                >
                  All Access Levels
                </DropdownMenuItem>
                {Object.keys(accessCategories).map(accessLevel => (
                  <DropdownMenuItem 
                    key={accessLevel}
                    className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedAccessFilter === accessLevel ? "bg-gray-800/50" : ""}`}
                    onClick={() => setSelectedAccessFilter(accessLevel)}
                  >
                    {accessLevel}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuLabel className="text-gray-300">Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                {sortOptions.map(sortOption => (
                  <DropdownMenuItem 
                    key={sortOption.value}
                    className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedSort === sortOption.value ? "bg-gray-800/50" : ""}`}
                    onClick={() => setSelectedSort(sortOption.value)}
                  >
                    {sortOption.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Add User */}
            <Button onClick={handleAddUser} className="bg-black text-white hover:bg-gray-900">
              <Plus className="h-4 w-4 mr-2" />
              Add user
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-700">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-gray-700 hover:bg-gray-800/30">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {sortedUsers.length > 0 && (
          <div className="flex items-center justify-between px-4 mt-6">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredRowModel().rows.length} user(s) total.
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
                  <ChevronsLeft className="h-4 w-4" />
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
                  <ChevronsRight className="h-4 w-4" />
              </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedAccessFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first user"
              }
            </p>
            {!searchTerm && selectedAccessFilter === "all" && (
              <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            )}
          </div>
        )}

        {/* Add User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New User
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new user account with specific access permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Avatar</Label>
                <div className="grid grid-cols-3 gap-2">
                  {defaultAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNewUser(prev => ({ ...prev, avatar }))}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        newUser.avatar === avatar 
                          ? 'border-blue-500 bg-blue-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Avatar className="h-8 w-8 mx-auto">
                        <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                        <AvatarFallback className="bg-gray-700 text-white text-xs">
                          {index + 1}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
              </div>

              {/* Access Levels */}
              <div className="space-y-2">
                <Label className="text-gray-300">Access Levels</Label>
                <div className="space-y-2">
                  {availableAccessLevels.map((access) => (
                    <div key={access.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={access.id}
                        checked={newUser.access.includes(access.id)}
                        onChange={() => toggleAccessLevel(access.id)}
                        className="border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      <Label 
                        htmlFor={access.id} 
                        className="text-sm text-gray-300 cursor-pointer flex-1"
                      >
                        <div className="font-medium">{access.label}</div>
                        <div className="text-xs text-gray-400">{access.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancelAddUser}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitNewUser}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeamPage;
