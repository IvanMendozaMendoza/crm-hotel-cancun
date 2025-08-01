"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Users, Shield, Settings, Database, FileText, ChartBar, Bell, Lock, Globe, Code, Palette, Search, Filter } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColorPicker } from "@/components/ui/color-picker";
import { toast } from "sonner";
import { CreateRoleGroupDialog } from "@/components/create-role-group-dialog";
import { EditRoleGroupDialog } from "@/components/edit-role-group-dialog";

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
    color: "#ef4444", // red-500
    permissions: Object.values(permissionCategories).flat(),
    userCount: 3,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Content Managers",
    description: "Manage content and moderate user-generated content",
    color: "#3b82f6", // blue-500
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
    color: "#22c55e", // green-500
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
    color: "#6b7280", // gray-500
    permissions: [
      "view_users",
      "view_content",
      "view_analytics"
    ],
    userCount: 12,
    createdAt: "2024-02-01"
  }
];

const TeamRolesPage = () => {
  const [roleGroups, setRoleGroups] = useState(initialRoleGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoleGroup, setEditingRoleGroup] = useState<any>(null);
  
  // Form state for creating/editing role groups
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // blue-500 hex
    permissions: [] as string[]
  });

  // Ensure color is always defined
  const currentColor = formData.color || "#3b82f6";

  const colorOptions = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-gray-500", label: "Gray" }
  ];

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

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const toggleCategoryPermissions = (category: string, permissions: string[]) => {
    const allSelected = permissions.every(perm => formData.permissions.includes(perm));
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !permissions.includes(p))
        : [...new Set([...prev.permissions, ...permissions])]
    }));
  };

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

        {/* Role Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoleGroups.map((roleGroup) => (
            <Card key={roleGroup.id} className="bg-stone-900 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roleGroup.color }} />
                    <div>
                      <CardTitle className="text-white">{roleGroup.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {roleGroup.permissions.length} permissions
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(roleGroup)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRoleGroup(roleGroup.id)}
                      className="text-gray-400 hover:text-red-400"
                      disabled={roleGroup.userCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{roleGroup.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{roleGroup.userCount} users</span>
                  </div>
                  <div className="text-gray-400">
                    Created {roleGroup.createdAt}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Key Permissions:</Label>
                  <div className="flex flex-wrap gap-1">
                    {roleGroup.permissions.slice(0, 5).map(permission => (
                                             <Badge key={permission} variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                        {getPermissionLabel(permission)}
                      </Badge>
                    ))}
                    {roleGroup.permissions.length > 5 && (
                                             <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                        +{roleGroup.permissions.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <EditRoleGroupDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          roleGroup={editingRoleGroup}
          onSubmit={handleEditRoleGroup}
        />

        {/* Empty State */}
        {filteredRoleGroups.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No role groups found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first role group"
              }
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Role Group
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRolesPage;
