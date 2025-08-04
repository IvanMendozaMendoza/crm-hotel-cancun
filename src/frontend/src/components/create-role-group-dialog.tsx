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
import { ColorPicker } from "@/components/ui/color-picker";
import { 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  Database, 
  BarChart3, 
  Lock, 
  Palette,
  Sparkles,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  X,
  ChevronDown
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

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

// Color presets with role context names
const colorPresets = [
  { value: "#3b82f6", name: "Admin", bg: "bg-blue-500" },
  { value: "#8b5cf6", name: "Manager", bg: "bg-purple-500" },
  { value: "#ef4444", name: "Editor", bg: "bg-red-500" },
  { value: "#f97316", name: "Moderator", bg: "bg-orange-500" },
  { value: "#22c55e", name: "Viewer", bg: "bg-green-500" },
  { value: "#eab308", name: "Custom", bg: "bg-yellow-500" }
];

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
    color: "#3b82f6",
    permissions: [] as string[]
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

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
      color: "#3b82f6",
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

  const selectedColor = colorPresets.find(c => c.value === formData.color);

  // Handle click outside color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setEditingColorIndex(null);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // Filter permissions based on search
  const filteredCategories = Object.entries(permissionCategories).filter(([category, { permissions }]) => {
    return searchTerm === "" || 
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permissions.some(perm => getPermissionLabel(perm).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] bg-gray-950 border border-gray-700 rounded-xl shadow-2xl">
          <DialogHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-800 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-white">
                    Create Role Group
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">
                    Define a new role with specific permissions and access levels
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-stone-800 text-gray-300 border-gray-600">
                  {formData.permissions.length} permissions
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-stone-900 border border-gray-700">
              <TabsTrigger value="details" className="data-[state=active]:bg-stone-800 data-[state=active]:text-white text-gray-400">
                <Sparkles className="h-4 w-4 mr-2" />
                Role Details
              </TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:bg-stone-800 data-[state=active]:text-white text-gray-400">
                <Lock className="h-4 w-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      Role Name
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Content Manager" 
                      className="bg-stone-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the purpose and responsibilities of this role..."
                      rows={4}
                      className="bg-stone-900 border-gray-700 text-white placeholder-gray-400 resize-none focus:border-gray-600 focus:ring-gray-600/20"
                    />
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-400" />
                      Role Color
                    </Label>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between p-3 bg-stone-900 rounded-lg border border-gray-700 hover:bg-stone-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-600" 
                              style={{ backgroundColor: formData.color }}
                            />
                            <span className="text-sm font-medium text-white">
                              {selectedColor?.name || "Select color"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full bg-stone-900 border-gray-700">
                        {colorPresets.map((color) => (
                          <DropdownMenuItem
                            key={color.value}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, color: color.value }));
                            }}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                          >
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-600" 
                              style={{ backgroundColor: color.value }}
                            />
                            <span className="text-sm font-medium text-white">{color.name}</span>
                            {formData.color === color.value && (
                              <CheckCircle2 className="ml-auto h-4 w-4 text-gray-400" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingColorIndex(colorPresets.findIndex(c => c.value === formData.color));
                          setShowColorPicker(true);
                        }}
                        className="flex items-center gap-3 p-3 bg-stone-900 rounded-lg border border-gray-700 hover:bg-stone-800 transition-colors cursor-pointer group w-full"
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-600" 
                          style={{ backgroundColor: formData.color }}
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white group-hover:text-gray-300 transition-colors">{selectedColor?.name}</p>
                          <p className="text-xs text-gray-400 font-mono group-hover:text-gray-300 transition-colors">{formData.color}</p>
                        </div>
                        <Palette className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      </button>
                      
                      {/* Color Picker Popover */}
                      {showColorPicker && editingColorIndex !== null && (
                        <div 
                          ref={colorPickerRef}
                          className="absolute top-full left-0 mt-2 p-4 bg-stone-900/95 border border-gray-700 rounded-lg shadow-2xl backdrop-blur-sm z-50"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            minWidth: '320px',
                            maxWidth: '400px'
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium text-gray-200">
                              Customize {colorPresets[editingColorIndex].name} Color
                            </Label>
                            <button
                              type="button"
                              onClick={() => {
                                setShowColorPicker(false);
                                setEditingColorIndex(null);
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                          <ColorPicker
                            value={formData.color}
                            onChange={(color) => {
                              setFormData(prev => ({ ...prev, color }));
                              // Update the color preset
                              colorPresets[editingColorIndex].value = color;
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Preview */}
              <div className="bg-stone-900 rounded-lg border border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Role Preview
                </h3>
                <div className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg border border-gray-700">
                  <div 
                    className="w-10 h-10 rounded-lg border border-gray-600 flex items-center justify-center" 
                    style={{ backgroundColor: formData.color }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">
                      {formData.name || "Untitled Role Group"}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {formData.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="bg-stone-800 text-gray-300 border-gray-600 text-xs">
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                    Permission Categories
                  </h3>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
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
                    className="pl-10 bg-stone-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600/20"
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
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {filteredCategories.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-300 mb-1">No permissions found</h3>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search terms
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map(([category, { icon: Icon, description, permissions }]) => (
                        <div key={category} className="bg-stone-900 border border-gray-700 rounded-lg overflow-hidden">
                          <div className="flex items-center gap-3 p-3 bg-stone-800 border-b border-gray-700">
                            <div className="p-1.5 bg-stone-700 rounded">
                              <Icon className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={permissions.every(perm => formData.permissions.includes(perm))}
                                  onCheckedChange={() => toggleCategoryPermissions(category, permissions)}
                                  className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600"
                                />
                                <Label className="font-medium text-white cursor-pointer text-sm">{category}</Label>
                                <Badge variant="outline" className="bg-stone-700 text-gray-300 border-gray-600 text-xs">
                                  {permissions.filter(perm => formData.permissions.includes(perm)).length}/{permissions.length}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 ml-6">{description}</p>
                            </div>
                          </div>
                          <div className="p-3 space-y-1">
                            {permissions.map(permission => (
                              <div key={permission} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-stone-800 transition-colors">
                                <Checkbox
                                  checked={formData.permissions.includes(permission)}
                                  onCheckedChange={() => togglePermission(permission)}
                                  className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600"
                                />
                                <Label className="text-sm text-gray-300 cursor-pointer flex-1">
                                  {getPermissionLabel(permission)}
                                </Label>
                                {formData.permissions.includes(permission) && (
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
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

          <DialogFooter className="border-t border-gray-700 pt-4 mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="border-gray-700 text-gray-300 hover:bg-stone-800">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={!formData.name.trim() || formData.permissions.length === 0}
              className="bg-white hover:bg-gray-100 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Role Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}; 