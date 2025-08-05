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
import { ArrowLeft, ArrowRight, CheckCircle, Info, User, Shield, Eye } from "lucide-react";
import { toast } from "sonner";

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
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                User name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
                placeholder="Enter user name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                The user name can have up to 64 characters. Valid characters: A-Z, a-z, 0-9, and +, =, ., @, _, - (hyphen)
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-2"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="console-access"
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="console-access" className="text-sm font-medium">
                  Enable console access
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow this user to access the system console
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Select role</Label>
              <div className="mt-3 space-y-3">
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.role === role.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-border/50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{role.label}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      </div>
                      {formData.role === role.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-destructive">{errors.role}</p>
              )}
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Additional permissions</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select specific permissions to grant to this user
              </p>
              
              <div className="mt-4 space-y-4">
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Review user details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">User name</Label>
                    <p className="mt-1">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="mt-1">{formData.email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <Badge variant="outline" className="mt-1">
                    {availableRoles.find(r => r.id === formData.role)?.label}
                  </Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Permissions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.permissions.length > 0 ? (
                      formData.permissions.map(permissionId => {
                        const permission = availablePermissions.find(p => p.id === permissionId);
                        return (
                          <Badge key={permissionId} variant="secondary" className="text-xs">
                            {permission?.label}
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No additional permissions selected</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${
                      formData.status === "active" 
                        ? "bg-green-500/10 text-green-600 border-green-500/20" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {formData.status === "active" ? "Active" : "Disabled"}
                  </Badge>
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
              <h3 className="text-lg font-semibold mb-6 lg:mb-8">Steps</h3>
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
                
                <div className="space-y-6 sm:space-y-8">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div key={step.id} className="relative flex items-start">
                        {/* Step circle */}
                        <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isActive 
                            ? "bg-primary border-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span className="text-sm font-medium">{step.id}</span>
                          )}
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
            <Card className="bg-card border-border">
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