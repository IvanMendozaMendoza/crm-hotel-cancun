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

type PasswordFormData = z.infer<typeof passwordSchema>;

interface SecurityFormProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
}

const PasswordInput = ({
  label,
  placeholder,
  showPassword,
  onTogglePassword,
  ...fieldProps
}: {
  label: string;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  [key: string]: any;
}) => (
  <FormItem>
    <FormLabel className="text-gray-300">{label}</FormLabel>
    <FormControl>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
          placeholder={placeholder}
          {...fieldProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
    </FormControl>
    <FormMessage />
  </FormItem>
);

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

const SECURITY_TIPS = [
  "Use a strong, unique password that you don't use elsewhere.",
  "Enable two-factor authentication for additional security.",
  "Never share your password or login credentials with anyone.",
  "Log out from shared or public computers after use.",
];

const SECURITY_INFO = [
  { label: "Last Password Change", value: "January 15, 2024" },
  {
    label: "Account Status",
    value: "Secure",
    status: { color: "green", indicator: "bg-green-500" },
  },
  { label: "Last Login", value: "Today at 2:30 PM" },
];

export const SecurityForm = ({ user }: SecurityFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordFields = useMemo(
    () => [
      {
        name: "currentPassword" as const,
        label: "Current Password",
        placeholder: "Enter your current password",
        key: "current",
      },
      {
        name: "newPassword" as const,
        label: "New Password",
        placeholder: "Enter your new password",
        key: "new",
      },
      {
        name: "confirmPassword" as const,
        label: "Confirm New Password",
        placeholder: "Confirm your new password",
        key: "confirm",
      },
    ],
    []
  );

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof passwordVisibility) => {
      setPasswordVisibility((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: PasswordFormData) => {
      setIsPending(true);
      try {
        const pwResult = await updatePassword(
          data.currentPassword,
          data.newPassword
        );

        if (pwResult) {
          toast.success(
            "Password updated successfully. You need to log in again."
          );
          setTimeout(() => {
            signOut({ callbackUrl: "/login" });
          }, 3500);

          form.reset();
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to update password");
      } finally {
        setIsPending(false);
      }
    },
    [form]
  );

  const isFormDirty = form.formState.isDirty;
  const isSubmitDisabled = isPending || !isFormDirty;

  return (
    <div className="grid gap-6">
      <InfoCard
        title="Change Password"
        description="Update your password to keep your account secure. You will be logged out after changing your password."
        icon={Lock}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-1">
              {passwordFields.map(({ name, label, placeholder, key }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <PasswordInput
                      label={label}
                      placeholder={placeholder}
                      showPassword={
                        passwordVisibility[
                          key as keyof typeof passwordVisibility
                        ]
                      }
                      onTogglePassword={() =>
                        togglePasswordVisibility(
                          key as keyof typeof passwordVisibility
                        )
                      }
                      {...field}
                    />
                  )}
                />
              ))}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Password Requirements
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Must be different from your current password</li>
                <li>• Consider using a mix of letters, numbers, and symbols</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-white hover:bg-gray-100 text-gray-900 px-6"
              >
                {isPending && <Info className="animate-spin w-4 h-4 mr-2" />}
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </InfoCard>

      <InfoCard
        title="Security Information"
        description="View your account security status and recent activity."
        icon={Shield}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {SECURITY_INFO.map(({ label, value, status }) => (
            <div key={label}>
              <Label className="text-gray-400 text-sm">{label}</Label>
              {status ? (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 ${status.indicator} rounded-full`}
                  ></div>
                  <span className={`text-${status.color}-400 text-sm`}>
                    {value}
                  </span>
                </div>
              ) : (
                <p className="text-white font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

       <InfoCard
        title="Security Tips"
        description="Best practices to keep your account secure."
        icon={Shield}
      >
        <div className="space-y-3">
          {SECURITY_TIPS.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
};
