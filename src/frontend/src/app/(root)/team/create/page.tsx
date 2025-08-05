"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Info, User, Shield, Eye, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "active" | "disabled";
  avatar: string;
}

const steps = [
  {
    id: 1,
    title: "Specify user details",
    description: "Enter basic user information",
    icon: User
  },
  {
    id: 2,
    title: "Set permissions",
    description: "Configure user access and roles",
    icon: Shield
  },
  {
    id: 3,
    title: "Review and create",
    description: "Review all information before creating",
    icon: Eye
  }
];

const availableRoles = [
  { id: "admin", label: "Admin", description: "Full system access with all permissions" },
  { id: "user", label: "User", description: "Standard user access with limited permissions" },
  { id: "viewer", label: "Viewer", description: "Read-only access to basic content" }
];

const availablePermissions = [
  { id: "view_users", label: "View Users", category: "User Management" },
  { id: "create_users", label: "Create Users", category: "User Management" },
  { id: "edit_users", label: "Edit Users", category: "User Management" },
  { id: "delete_users", label: "Delete Users", category: "User Management" },
  { id: "view_content", label: "View Content", category: "Content Management" },
  { id: "create_content", label: "Create Content", category: "Content Management" },
  { id: "edit_content", label: "Edit Content", category: "Content Management" },
  { id: "delete_content", label: "Delete Content", category: "Content Management" },
  { id: "view_analytics", label: "View Analytics", category: "Analytics & Reports" },
  { id: "create_reports", label: "Create Reports", category: "Analytics & Reports" },
  { id: "export_data", label: "Export Data", category: "Data Management" },
  { id: "import_data", label: "Import Data", category: "Data Management" }
];

const defaultAvatars = [
  "/avatars/default-1.jpg",
  "/avatars/default-2.jpg",
  "/avatars/default-3.jpg",
  "/avatars/default-4.jpg",
  "/avatars/default-5.jpg",
  "/avatars/default-6.jpg"
];

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

// Sample role groups data (same as in roles page)
const roleGroups = [
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
  },
];

// Helper function to get permission label
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

const CreateUserPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "",
    permissions: [],
    status: "active",
    avatar: defaultAvatars[0]
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "User name is required";
      } else if (formData.name.length > 64) {
        newErrors.name = "User name cannot exceed 64 characters";
      } else if (!/^[A-Za-z0-9+=.@_-]+$/.test(formData.name)) {
        newErrors.name = "User name contains invalid characters";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (step === 2) {
      if (!formData.role) {
        newErrors.role = "Please select a role";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateUser = async () => {
    if (validateStep(currentStep)) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(`User "${formData.name}" created successfully`);
        router.push('/team');
      } catch (error) {
        toast.error("Failed to create user. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    router.push('/team');
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: typeof availablePermissions } = {};
    availablePermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">User name</Label>
                <Input
                  id="name"
                  placeholder="Enter user name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  The user name can have up to 64 characters. Valid characters: A-Z, a-z, 0-9, and +, =, ., @, , - (hyphen)
                </p>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="console-access"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked ? "active" : "disabled" })
                  }
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="console-access" className="text-sm font-medium">Enable console access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow this user to access the system console
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-semibold">Select role group</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a security group for this user. Each user can only be assigned to one role group.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/team/roles/create')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create group
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-700">
              <Table>
                <TableHeader className="bg-stone-900">
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 font-medium w-12">Select</TableHead>
                    <TableHead className="text-gray-300 font-medium">Role Group</TableHead>
                    <TableHead className="text-gray-300 font-medium">Users</TableHead>
                    <TableHead className="text-gray-300 font-medium">Permissions</TableHead>
                    <TableHead className="text-gray-300 font-medium">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleGroups.map((roleGroup) => (
                    <TableRow key={roleGroup.id} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell>
                        <Checkbox
                          className="ml-4"
                          checked={formData.role === roleGroup.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, role: roleGroup.id });
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{roleGroup.name}</div>
                          <div className="text-sm text-gray-400">{roleGroup.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{roleGroup.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="link" className="h-auto p-0 text-gray-300 hover:text-white">
                              {roleGroup.permissions.length} permissions
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0 bg-stone-900 border-gray-700">
                            <Command>
                              <CommandInput placeholder="Search permissions..." className="border-gray-700" />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>No permissions found.</CommandEmpty>
                                <CommandGroup>
                                  {roleGroup.permissions.map((permission) => (
                                    <CommandItem key={permission} className="flex items-center gap-2 text-gray-300 hover:bg-gray-800">
                                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                                      {getPermissionLabel(permission)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{roleGroup.createdAt}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {formData.role && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Selected role group: <strong>{roleGroups.find(r => r.id === formData.role)?.name}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review user details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">User name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">{formData.email}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {roleGroups.find(r => r.id === formData.role)?.name || "No role selected"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Permissions</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.role 
                      ? `${roleGroups.find(r => r.id === formData.role)?.permissions.length || 0} permissions from selected role group`
                      : "No additional permissions selected"
                    }
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                      {formData.status === "active" ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please review all information carefully. You can modify any details by going back to previous steps.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to users
          </Button>
          <h1 className="text-2xl font-semibold">Create new user</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-24">
          {/* Vertical Steps Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-6">
              {/* <h3 className="text-lg font-semibold mb-6 lg:mb-8">Steps</h3> */}
              
              {/* Progress Bar */}
              <div className="mb-8 mt-8">
                <Progress value={(currentStep / steps.length) * 100} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Step {currentStep}</span>
                  <span>of {steps.length}</span>
                </div>
              </div>
              
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-border" />
                
                <div className="space-y-6 sm:space-y-8">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div key={step.id} className="relative flex items-start">
                        {/* Step circle */}
                        <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isActive 
                            ? "bg-primary border-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground"
                        }`}>
                          <span className="text-sm font-medium">{step.id}</span>
                        </div>
                        
                        {/* Step content */}
                        <div className="ml-4 flex-1 min-w-0">
                          <h3 className={`font-medium text-sm ${
                            isActive ? "text-primary" : "text-foreground"
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = steps[currentStep - 1].icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                
                {currentStep === steps.length ? (
                  <Button
                    onClick={handleCreateUser}
                  >
                    Create user
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage; 