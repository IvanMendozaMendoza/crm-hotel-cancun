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
import { Control, useForm } from "react-hook-form";
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
  <Card className="bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-zinc-100">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription className="text-slate-600 dark:text-zinc-300">{description}</CardDescription>
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
  name: keyof ProfileFormData;
  placeholder: string;
  type?: string;
  control: Control<ProfileFormData>;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-slate-700 dark:text-zinc-200">{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/20"
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

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      setIsPending(true);
      try {
        const updateData: { username?: string; email?: string } = {};

        if (data.username !== user.username) {
          updateData.username = data.username;
        }

        if (data.email !== user.email) {
          updateData.email = data.email;
        }

        if (Object.keys(updateData).length === 0) {
          toast.info("No changes to save");
          setIsPending(false);
          return;
        }

        const meResult = await updateMe(updateData);

        if (meResult) {
          toast.success(
            "Profile updated successfully. You need to log in again."
          );
          setTimeout(() => {
            signOut({ callbackUrl: "/login" });
          }, 3500);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        toast.error(errorMessage);
      } finally {
        setIsPending(false);
      }
    },
    [user.username, user.email]
  );

  const watchedValues = form.watch();
  const hasChanges = useMemo(() => {
    return (
      watchedValues.username !== user.username ||
      watchedValues.email !== user.email
    );
  }, [watchedValues.username, watchedValues.email, user.username, user.email]);

  const isSubmitDisabled = isPending || !hasChanges;

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
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.avatar || "/avatars/default.jpg"}
                  alt={user.username}
                />
                <AvatarFallback className="bg-slate-700 text-white text-lg dark:bg-zinc-600 dark:text-zinc-100">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-zinc-100">{user.username}</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400">Profile picture</p>
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
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100"
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
              <Label className="text-slate-600 dark:text-zinc-400 text-sm">{label}</Label>
              {type === "roles" ? (
                <div className="flex gap-2 mt-1">
                  {user.roles?.map((role: string) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-zinc-100 font-medium">
                  {type === "text" ? value : user[value as keyof typeof user]}
                </p>
              )}
            </div>
          ))}
          <div>
            <Label className="text-slate-600 dark:text-zinc-400 text-sm">Account Roles</Label>
            <div className="flex gap-2 mt-1">
              {user.roles?.map((role: string) => (
                <span
                  key={role}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40"
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
