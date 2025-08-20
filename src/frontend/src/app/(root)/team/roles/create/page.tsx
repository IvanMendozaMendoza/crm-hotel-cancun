"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Info, Shield, Eye, CheckCircle, Search, Filter, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  "Security": [
    "view_security",
    "manage_permissions",
    "audit_logs",
    "security_settings",
  ],
};

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

const getPermissionLabel = (permission: string) => permissionLabels[permission] || permission;

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

const steps = [
  {
    id: 1,
    title: "Specify role details",
    description: "Enter basic role group information",
    icon: Shield,
  },
  {
    id: 2,
    title: "Select permissions",
    description: "Choose capabilities for this role",
    icon: Shield,
  },
  {
    id: 3,
    title: "Review and create",
    description: "Review all information before creating",
    icon: Eye,
  },
];

const StepIndicator = ({ step, currentStep }: { step: { id: number; title: string; description: string }; currentStep: number }) => {
  const isActive = currentStep === step.id;
  const isCompleted = currentStep > step.id;

  return (
    <div className="relative flex items-start">
      <div
        className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isActive
            ? "bg-primary border-primary text-primary-foreground"
            : isCompleted
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-background border-border text-muted-foreground"
        }`}
      >
        <span className="text-sm font-medium">{step.id}</span>
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <h3
          className={`font-medium text-sm ${
            isActive ? "text-primary" : "text-foreground"
          }`}
        >
          {step.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};

const PermissionTable = ({
  currentPageRows,
  formData,
  onTogglePermission,
}: {
  currentPageRows: Array<{ category: string; key: string; label: string }>;
  formData: RoleFormData;
  onTogglePermission: (permissionId: string) => void;
}) => (
  <div className="overflow-hidden rounded-lg border border-gray-700">
    <Table>
      <TableHeader className="bg-stone-900">
        <TableRow className="border-gray-700">
          <TableHead className="text-gray-300 font-medium w-12">Select</TableHead>
          <TableHead className="text-gray-300 font-medium">Permission</TableHead>
          <TableHead className="text-gray-300 font-medium">Category</TableHead>
          <TableHead className="text-gray-300 font-medium">Key</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentPageRows.length ? (
          currentPageRows.map((row) => (
            <TableRow key={`${row.category}:${row.key}`} className="border-gray-700 hover:bg-gray-800/60">
              <TableCell>
                <Checkbox
                  checked={formData.permissions.includes(row.key)}
                  onCheckedChange={() => onTogglePermission(row.key)}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.key}</div>
              </TableCell>
              <TableCell>
                <span className="text-gray-300">{row.category}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-gray-300 border-gray-700">
                  {row.key}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-gray-400">
              No permissions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const Pagination = ({
  pageIndex,
  pageCount,
  onPageChange,
}: {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between px-4 mt-6">
    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
      Page {pageIndex + 1} of {pageCount}
    </div>
    <div className="flex w-full items-center gap-8 lg:w-fit">
      <div className="flex w-fit items-center justify-center text-sm font-medium text-gray-300">
        Page {pageIndex + 1} of {pageCount}
      </div>
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(0)}
          disabled={pageIndex === 0}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => onPageChange(Math.min(pageCount - 1, pageIndex + 1))}
          disabled={pageIndex >= pageCount - 1}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const CreateRoleGroupPage = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
  });
  const [errors, setErrors] = useState<Partial<RoleFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [pageIndex, setPageIndex] = useState(0);

  const allPermissions = useMemo(() => Object.values(permissionCategories).flat(), []);

  const permissionRows = useMemo(
    () =>
      Object.entries(permissionCategories).flatMap(([category, perms]) =>
        perms.map((key) => ({
          key,
          label: getPermissionLabel(key),
          category,
        }))
      ),
    []
  );

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return permissionRows.filter((row) => {
      const matchesCategory = selectedCategory === "all" || row.category === selectedCategory;
      const matchesSearch = !q || row.label.toLowerCase().includes(q) || row.key.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [permissionRows, searchTerm, selectedCategory]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPageRows = useMemo(
    () => filteredRows.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
    [filteredRows, pageIndex]
  );

  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, selectedCategory]);

  const validateStep = useCallback((step: number) => {
    const nextErrors: Partial<RoleFormData> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        nextErrors.name = "Role name is required";
      } else if (formData.name.length > 64) {
        nextErrors.name = "Role name cannot exceed 64 characters";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formData.name]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleCancel = useCallback(() => router.push("/team/roles"), [router]);

  const handleCreate = useCallback(async () => {
    if (!validateStep(currentStep)) return;
    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      toast.success(`Role group "${formData.name}" created successfully`, {
        icon: <CheckCircle className="h-4 w-4 text-green-400" />,
      });
      router.push("/team/roles");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create role group. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, formData.name, validateStep, router]);

  const togglePermission = useCallback((permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  }, []);

  const selectAll = useCallback(() =>
    setFormData((prev) => ({
      ...prev,
      permissions: Array.from(new Set([...prev.permissions, ...allPermissions])),
    })), [allPermissions]);

  const clearAll = useCallback(() => setFormData((prev) => ({ ...prev, permissions: [] })), []);

  const handlePageChange = useCallback((page: number) => {
    setPageIndex(page);
  }, []);

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">Role name</Label>
              <Input
                id="name"
                placeholder="e.g. Content Managers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <p className="text-sm text-muted-foreground mt-2">
                The role name can have up to 64 characters.
              </p>
              {errors.name && (
                <p className="text-xs text-red-400 mt-2">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Short description of what this role can do"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border bg-background border-border text-foreground placeholder-muted-foreground p-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Select permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Choose which capabilities this role will grant.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search permissions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-zinc-900 border-gray-700 w-56">
                  <DropdownMenuLabel className="text-gray-300">Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className={`text-gray-300 hover:text-black hover:bg-stone-300 ${selectedCategory === "all" ? "bg-gray-800/50" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {Object.keys(permissionCategories).map((category) => (
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

              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select all
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            </div>

            <PermissionTable
              currentPageRows={currentPageRows}
              formData={formData}
              onTogglePermission={togglePermission}
            />

            {filteredRows.length > 0 && (
              <Pagination
                pageIndex={pageIndex}
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review role details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Role name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Permissions</Label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {formData.permissions.length} selected
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {formData.description || "No description"}
                  </p>
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
  }, [currentStep, formData, searchTerm, selectedCategory, currentPageRows, pageIndex, pageCount, errors.name, togglePermission, selectAll, clearAll, handlePageChange, filteredRows.length]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to roles
          </Button>
          <h1 className="text-2xl font-semibold">Create new role group</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-24">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-6">
              <div className="mb-8 mt-8">
                <Progress value={(currentStep / steps.length) * 100} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Step {currentStep}</span>
                  <span>of {steps.length}</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-border" />

                <div className="space-y-6 sm:space-y-8">
                  {steps.map((step) => (
                    <StepIndicator key={step.id} step={step} currentStep={currentStep} />
                  ))}
                </div>
              </div>
            </div>
          </div>

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
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>{renderStepContent()}</CardContent>
            </Card>

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
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>

                {currentStep === steps.length ? (
                  <Button onClick={handleCreate} disabled={isSubmitting || !formData.name.trim()}>
                    {isSubmitting ? "Creating..." : "Create role group"}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
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

export default CreateRoleGroupPage;
