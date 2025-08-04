"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { updateMe } from "@/app/actions/account";
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

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

interface SettingsFormProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsPending(true);
    try {
      const meResult = await updateMe({
        username: data.username,
        email: data.email,
      });
      
      if (meResult) {
        toast.success("Profile updated successfully. You need to log in again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3500);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Profile Information Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Update your basic profile information. Changes to email or username will require you to log in again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar || "/avatars/default.jpg"} alt={user.username} />
                  <AvatarFallback className="bg-gray-700 text-white text-lg">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{user.username}</h3>
                  <p className="text-sm text-gray-400">Profile picture</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter your username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          {...field} 
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                  className="bg-white hover:bg-gray-100 text-gray-900 px-6"
                >
                  {isPending && <Info className="animate-spin w-4 h-4 mr-2" />}
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            View your current account details and roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-400 text-sm">Current Username</Label>
              <p className="text-white font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Current Email</Label>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Account Roles</Label>
              <div className="flex gap-2 mt-1">
                {user.roles?.map((role: string) => (
                  <span
                    key={role}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Member Since</Label>
              <p className="text-white font-medium">January 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 