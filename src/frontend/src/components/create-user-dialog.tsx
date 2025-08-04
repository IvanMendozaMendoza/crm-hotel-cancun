import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";

export const CreateUserDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create user form submitted:", formData);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Don't render anything if not open
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Create New User
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Fill in the details to create a new user account
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-200">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name" 
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-200">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm Password"
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <hr className="border-gray-700 my-4" />
            
            <div>
              <Label htmlFor="roles">Role Group</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select a role group" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-400">Role Groups</SelectLabel>
                    <SelectItem value="admin" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        Administrators
                      </div>
                    </SelectItem>
                    <SelectItem value="content-manager" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Content Managers
                      </div>
                    </SelectItem>
                    <SelectItem value="analyst" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        Data Analysts
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        Viewers
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
              className="bg-white hover:bg-gray-100 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
