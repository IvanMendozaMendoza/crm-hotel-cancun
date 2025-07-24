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
import { Info } from "lucide-react";
import { toast } from "sonner";

import React from "react";
import { z } from "zod";
import { env } from "@/config/env";
import { updateMe, updatePassword } from "@/app/actions/account";
import { signIn, signOut } from "next-auth/react";
import { User } from "@/types/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export const AccountDialog = ({
  open,
  onOpenChange,
  user
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) => {
  const [isPending, setIsPending] = React.useState(false);

  // Zod schemas
  const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).refine((data) => {
    if (data.newPassword || data.confirmPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsPending(true);
    let reverted = false;
    try {
      let hasUpdates = false;
      let needsReauth = false;
      let latestJwt: string | null = null;
      let didShowLogoutToast = false;

      // 1. Update username/email if changed
      if (data.username !== user.username || data.email !== (user.email || "")) {
        try {
          const meResult = await updateMe({ username: data.username, email: data.email });
          if (meResult) {
            hasUpdates = true;
            if (meResult.newJwt) {
              latestJwt = meResult.newJwt;
            }
            didShowLogoutToast = true;
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to update profile");
          reverted = true;
          throw err;
        }
      }

      // 2. Update password if changed
      if (
        data.currentPassword &&
        data.newPassword &&
        data.newPassword === data.confirmPassword
      ) {
        try {
          const pwResult = await updatePassword(
            data.currentPassword,
            data.newPassword,
            latestJwt
          );
          if (pwResult) {
            hasUpdates = true;
            needsReauth = true;
            didShowLogoutToast = true;
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to update password");
          reverted = true;
          throw err;
        }
      }

      if (hasUpdates && didShowLogoutToast) {
        onOpenChange(false);
        toast.success("Account settings updated successfully. You need to log in again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3500);
        setIsPending(false);
        return;
      }
    } catch (err: any) {
      // errors handled above
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 lg:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="mb-6">
              <DialogTitle>Your Account Settings</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8">
              <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <div className="mt-2 mb-6">
                  <hr className="border-zinc-800" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6 w-full max-w-2xl mx-auto">
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">Change Password</h3>
                  <div className="flex flex-col gap-5 lg:flex-row md:gap-8">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Current password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="New password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Confirm new password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-10 flex flex-row gap-4 justify-end border-t border-zinc-800 pt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                className="font-semibold px-8 py-2 rounded-lg text-base disabled:opacity-60 disabled:cursor-not-allowed bg-zinc-800 hover:bg-zinc-700 text-white"
                disabled={isPending || !form.formState.isDirty || form.formState.isSubmitting}
              >
                {isPending ? <Info className="animate-spin w-4 h-4 mr-2 inline" /> : null}
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
