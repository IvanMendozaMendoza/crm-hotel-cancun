"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { updatePassword } from "@/app/actions/account";
import { signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword !== data.currentPassword;
      }
      return true;
    },
    {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }
  );

interface SecurityFormProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
}

export const SecurityForm = ({ user }: SecurityFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsPending(true);
    try {
      const pwResult = await updatePassword(
        data.currentPassword,
        data.newPassword
      );
      
      if (pwResult) {
        toast.success("Password updated successfully. You need to log in again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3500);
        
        // Reset form
        form.reset();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Password Change Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription className="text-gray-400">
            Update your password to keep your account secure. You will be logged out after changing your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-1">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showCurrentPassword ? "text" : "password"}
                            {...field} 
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showNewPassword ? "text" : "password"}
                            {...field} 
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                            placeholder="Enter your new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            {...field} 
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                            placeholder="Confirm your new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Must be different from your current password</li>
                  <li>• Consider using a mix of letters, numbers, and symbols</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                  className="bg-white hover:bg-gray-100 text-gray-900 px-6"
                >
                  {isPending && <Info className="animate-spin w-4 h-4 mr-2" />}
                  {isPending ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Information Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            View your account security status and recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-400 text-sm">Last Password Change</Label>
              <p className="text-white font-medium">January 15, 2024</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Account Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Secure</span>
              </div>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Two-Factor Authentication</Label>
              <p className="text-white font-medium">Not enabled</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Last Login</Label>
              <p className="text-white font-medium">Today at 2:30 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Security Tips</CardTitle>
          <CardDescription className="text-gray-400">
            Best practices to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Use a strong, unique password that you don't use elsewhere.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Enable two-factor authentication for additional security.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Never share your password or login credentials with anyone.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Log out from shared or public computers after use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 