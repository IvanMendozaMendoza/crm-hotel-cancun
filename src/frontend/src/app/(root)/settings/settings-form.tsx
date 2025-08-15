"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type ProfileFormData = z.infer<typeof profileSchema>;

interface SettingsFormProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
}

const InfoCard = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Card className="bg-stone-900 border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription className="text-gray-400">{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const FormInput = ({
  label,
  name,
  placeholder,
  type = "text",
  control,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-300">{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ACCOUNT_INFO = [
  { label: "Current Username", value: "username", type: "text" },
  { label: "Current Email", value: "email", type: "text" },
  { label: "Member Since", value: "January 2024", type: "text" },
];

export const SettingsForm = ({ user }: SettingsFormProps) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
    },
  });

  const formFields = useMemo(
    () => [
      {
        name: "username" as const,
        label: "Username",
        placeholder: "Enter your username",
        type: "text",
      },
      {
        name: "email" as const,
        label: "Email Address",
        placeholder: "Enter your email",
        type: "email",
      },
    ],
    []
  );

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    setIsPending(true);
    try {
      const meResult = await updateMe({
        username: data.username,
        email: data.email,
      });

      if (meResult) {
        toast.success(
          "Profile updated successfully. You need to log in again."
        );
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3500);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsPending(false);
    }
  }, []);

  const isFormDirty = form.formState.isDirty;
  const isSubmitDisabled = isPending || !isFormDirty;

  return (
    <div className="grid gap-6">
      <InfoCard
        title="Profile Information"
        description="Update your basic profile information. Changes to email or username will require you to log in again."
        icon={User}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.avatar || "/avatars/default.jpg"}
                  alt={user.username}
                />
                <AvatarFallback className="bg-gray-700 text-white text-lg">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{user.username}</h3>
                <p className="text-sm text-gray-400">Profile picture</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {formFields.map(({ name, label, placeholder, type }) => (
                <FormInput
                  key={name}
                  control={form.control}
                  label={label}
                  name={name}
                  placeholder={placeholder}
                  type={type}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-white hover:bg-gray-100 text-gray-900 px-6"
              >
                {isPending && <Info className="animate-spin w-4 h-4 mr-2" />}
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </InfoCard>

      <InfoCard
        title="Account Information"
        description="View your current account details and roles."
        icon={Mail}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {ACCOUNT_INFO.map(({ label, value, type }) => (
            <div key={label}>
              <Label className="text-gray-400 text-sm">{label}</Label>
              {type === "roles" ? (
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
              ) : (
                <p className="text-white font-medium">
                  {type === "text" ? value : user[value as keyof typeof user]}
                </p>
              )}
            </div>
          ))}
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
        </div>
      </InfoCard>
    </div>
  );
};
