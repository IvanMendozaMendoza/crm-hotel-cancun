"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Filter, ChevronDown, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";

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

const TeamPage = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedAccessFilter, setSelectedAccessFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("name_asc");

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

  const handleAddUser = () => {
    toast.success("Add user functionality will be implemented");
  };

  const handleUpdateUser = (userName: string) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

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

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="bg-stone-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Access</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last active</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date added</th>
                    <th className="px-6 py-4 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.lastActive}</td>
                      <td className="px-6 py-4 text-gray-300">{user.dateAdded}</td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {sortedUsers.map((user) => (
            <div key={user.id} className="bg-stone-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{user.name}</div>
                    <div className="text-sm text-gray-400 truncate">{user.email}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.access.map((access) => (
                        <Badge
                          key={access}
                          variant="outline"
                          className={`${getAccessBadgeColor(access)} border text-xs`}
                        >
                          {access}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
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
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400">
                  <div>Last active: {user.lastActive}</div>
                  <div>Added: {user.dateAdded}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-400 text-center sm:text-left">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, sortedUsers.length)} of {sortedUsers.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="h-4 w-4 rotate-90 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(sortedUsers.length / 10), prev + 1))}
              disabled={currentPage >= Math.ceil(sortedUsers.length / 10)}
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronDown className="h-4 w-4 -rotate-90 ml-2" />
            </Button>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">"Amélie Laurent" details updated</p>
                <div className="flex gap-4 mt-2">
                  <button className="text-blue-400 text-sm hover:text-blue-300">Undo</button>
                  <button className="text-blue-400 text-sm hover:text-blue-300">View profile</button>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
