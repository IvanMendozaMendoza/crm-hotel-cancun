import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  FileText, 
  Settings, 
  Database, 
  BarChart3, 
  Lock, 
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  X,
  Settings2
} from "lucide-react";
import React, { useState } from "react";

// Permission categories with icons and descriptions
const permissionCategories = {
  "User Management": {
    icon: Users,
    description: "Manage user accounts and profiles",
    permissions: [
      "view_users",
      "create_users", 
      "edit_users",
      "delete_users",
      "assign_roles"
    ]
  },
  "Content Management": {
    icon: FileText,
    description: "Create and manage content",
    permissions: [
      "view_content",
      "create_content",
      "edit_content", 
      "delete_content",
      "publish_content"
    ]
  },
  "System Administration": {
    icon: Settings,
    description: "System configuration and maintenance",
    permissions: [
      "view_settings",
      "edit_settings",
      "view_logs",
      "manage_backups",
      "system_maintenance"
    ]
  },
  "Data Management": {
    icon: Database,
    description: "Handle data operations and exports",
    permissions: [
      "view_data",
      "export_data",
      "import_data",
      "delete_data",
      "anonymize_data"
    ]
  },
  "Analytics & Reports": {
    icon: BarChart3,
    description: "Access analytics and reporting tools",
    permissions: [
      "view_analytics",
      "create_reports",
      "export_reports",
      "share_reports"
    ]
  },
  "Security": {
    icon: Lock,
    description: "Security and access control",
    permissions: [
      "view_security",
      "manage_permissions",
      "audit_logs",
      "security_settings"
    ]
  }
};



export const CreateRoleGroupDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create form submitted:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form
    setFormData({
      name: "",
      description: "",
      permissions: []
    });
    onOpenChange(false);
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



  // Filter permissions based on search
  const filteredCategories = Object.entries(permissionCategories).filter(([category, { permissions }]) => {
    return searchTerm === "" || 
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permissions.some(perm => getPermissionLabel(perm).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/50 rounded-2xl shadow-2xl backdrop-blur-xl">
          <DialogHeader className="pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Create Role Group
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-1">
                  Define a new role with specific permissions and access levels
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {formData.permissions.length} permissions
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 border border-zinc-800">
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
                <Settings2 className="h-4 w-4 mr-2" />
                Role Details
              </TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
                <Lock className="h-4 w-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Users className="h-4 w-4 text-white" />
                      Role Name
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Content Manager" 
                      className="bg-zinc-900/50 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-white" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the purpose and responsibilities of this role..."
                      rows={4}
                      className="bg-zinc-900/50 border-zinc-700 text-white placeholder-gray-400 resize-none focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>


              </div>

              {/* Role Preview */}
              <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Role Preview
                </h3>
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="w-12 h-12 rounded-xl border border-zinc-600 shadow-lg flex items-center justify-center bg-stone-800">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">
                      {formData.name || "Untitled Role Group"}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {formData.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {formData.permissions.length} permissions
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created just now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-white" />
                    Permission Categories
                  </h3>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    {formData.permissions.length} selected
                  </Badge>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Results Summary */}
                {searchTerm && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Search className="h-4 w-4" />
                    <span>
                      Found {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : 'y'} 
                      {searchTerm && ` matching "${searchTerm}"`}
                    </span>
                  </div>
                )}
                
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {filteredCategories.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No permissions found</h3>
                        <p className="text-gray-400">
                          Try adjusting your search terms or category filter
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map(([category, { icon: Icon, description, permissions }]) => (
                        <div key={category} className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden shadow-lg">
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 border-b border-zinc-700">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={permissions.every(perm => formData.permissions.includes(perm))}
                                  onCheckedChange={() => toggleCategoryPermissions(category, permissions)}
                                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <Label className="font-semibold text-white cursor-pointer">{category}</Label>
                                <Badge variant="outline" className="bg-zinc-700/50 text-gray-300 border-zinc-600">
                                  {permissions.filter(perm => formData.permissions.includes(perm)).length}/{permissions.length}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mt-1 ml-8">{description}</p>
                            </div>
                          </div>
                          <div className="p-4 space-y-2">
                            {permissions.map(permission => (
                              <div key={permission} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                                <Checkbox
                                  checked={formData.permissions.includes(permission)}
                                  onCheckedChange={() => togglePermission(permission)}
                                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <Label className="text-sm text-gray-300 cursor-pointer flex-1">
                                  {getPermissionLabel(permission)}
                                </Label>
                                {formData.permissions.includes(permission) && (
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t border-zinc-800 pt-6 mt-8">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={!formData.name.trim() || formData.permissions.length === 0}
              className="bg-white hover:bg-gray-100 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed px-8"
            >
              Create Role Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}; 