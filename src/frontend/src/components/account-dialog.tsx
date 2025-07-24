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
  const [formState, setFormState] = React.useState({
    username: user.username,
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [optimisticState, setOptimisticState] = React.useOptimistic(formState);
  const [passwordError, setPasswordError] = React.useState("");
  const [currentPasswordError, setCurrentPasswordError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");

  const isChanged =
    optimisticState.username !== user.username ||
    optimisticState.email !== (user.email || "") ||
    optimisticState.currentPassword !== "" ||
    optimisticState.newPassword !== "" ||
    optimisticState.confirmPassword !== "";

  // Zod password schema
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Zod schemas
  const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
  });

  // Optimistic update handler
  const handleOptimisticChange = (field: string, value: string) => {
    React.startTransition(() => {
      setOptimisticState((prev) => ({ ...prev, [field]: value }));
    });
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setPasswordError("");
    setCurrentPasswordError("");
    setEmailError("");
    setUsernameError("");
    let reverted = false;

    try {
      // Profile validation
      const profileResult = profileSchema.safeParse({
        username: optimisticState.username,
        email: optimisticState.email,
      });
      if (!profileResult.success) {
        const errors = profileResult.error.flatten().fieldErrors;
        if (errors.username) setUsernameError(errors.username[0]);
        if (errors.email) setEmailError(errors.email[0]);
        setIsPending(false);
        return;
      }

      // Password validation (if password fields are filled)
      if (
        optimisticState.currentPassword ||
        optimisticState.newPassword ||
        optimisticState.confirmPassword
      ) {
        const result = passwordSchema.safeParse({
          currentPassword: optimisticState.currentPassword,
          newPassword: optimisticState.newPassword,
          confirmPassword: optimisticState.confirmPassword,
        });
        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          if (errors.newPassword) setPasswordError(errors.newPassword[0]);
          if (errors.confirmPassword) setPasswordError(errors.confirmPassword[0]);
          if (errors.currentPassword) setCurrentPasswordError(errors.currentPassword[0]);
          setIsPending(false);
          return;
        }
      }

      let hasUpdates = false;
      let needsReauth = false;
      let latestJwt: string | null = null;

      // 1. Update username/email if changed
      if (optimisticState.username !== user.username || optimisticState.email !== (user.email || "")) {
        React.startTransition(() => {
          setOptimisticState((prev) => ({ ...prev, username: optimisticState.username, email: optimisticState.email }));
        });
        try {
          const meResult = await updateMe({ username: optimisticState.username, email: optimisticState.email });
          if (meResult) {
            hasUpdates = true;
            if (meResult.newJwt) {
              latestJwt = meResult.newJwt;
            }
          }
        } catch (err: any) {
          React.startTransition(() => {
            setOptimisticState((prev) => ({ ...prev, username: user.username, email: user.email || "" }));
          });
          toast.error(err.message || "Failed to update profile");
          reverted = true;
          throw err;
        }
      }

      // 2. Update password if changed, using the latest JWT
      if (
        optimisticState.currentPassword &&
        optimisticState.newPassword &&
        optimisticState.newPassword === optimisticState.confirmPassword
      ) {
        React.startTransition(() => {
          setOptimisticState((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        });
        try {
          const pwResult = await updatePassword(
            optimisticState.currentPassword, 
            optimisticState.newPassword,
            latestJwt
          );
          if (pwResult) {
            hasUpdates = true;
            needsReauth = true;
            // Final re-authentication with new password
            const signInResult = await signIn("credentials", {
              redirect: false,
              email: optimisticState.email,
              password: optimisticState.newPassword,
            });
            if (signInResult?.error) {
              toast.error("Failed to update session with new credentials. Please log in again.");
              setTimeout(() => {
                signOut({ callbackUrl: "/login" });
              }, 2000);
              return;
            }
          }
        } catch (err: any) {
          React.startTransition(() => {
            setOptimisticState((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
          });
          setCurrentPasswordError(err.message || "Failed to update password");
          reverted = true;
          throw err;
        }
      }

      if (hasUpdates) {
        toast.success("Account settings updated successfully.");
        if (needsReauth) {
          toast.info("Please wait while your session is updated...");
        }
        onOpenChange(false);
      }
    } catch (err: any) {
      if (!reverted) {
        if (err.message?.toLowerCase().includes("password")) {
          setCurrentPasswordError(err.message);
        } else if (err.message?.toLowerCase().includes("email") || err.message?.toLowerCase().includes("profile") || err.message?.toLowerCase().includes("name")) {
          setPasswordError("");
          setCurrentPasswordError("");
          toast.error(err.message);
        } else {
          toast.error(err.message || "Failed to update account settings.");
        }
      }
    } finally {
      setIsPending(false);
    }
  };

  // Clear password errors on password field change
  React.useEffect(() => {
    setPasswordError("");
    setCurrentPasswordError("");
  }, [optimisticState.currentPassword, optimisticState.newPassword, optimisticState.confirmPassword]);

  // Clear profile errors on field change
  React.useEffect(() => {
    setEmailError("");
    setUsernameError("");
  }, [optimisticState.username, optimisticState.email]);

  // Reset password fields when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormState(s => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      React.startTransition(() => {
        setOptimisticState(s => ({
          ...s,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      });
      setPasswordError("");
      setCurrentPasswordError("");
    }
  }, [open, setOptimisticState]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 lg:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle>Your Account Settings</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username-1">Username</Label>
                <Input id="username-1" name="username" value={optimisticState.username} onChange={e => handleOptimisticChange("username", e.target.value)} />
                {usernameError && <span className="text-xs text-red-500 mt-1">{usernameError}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email-1">Email</Label>
                <Input id="email-1" name="email" type="email" value={optimisticState.email} onChange={e => handleOptimisticChange("email", e.target.value)} />
                {emailError && <span className="text-xs text-red-500 mt-1">{emailError}</span>}
              </div>
            </div>
            <div className="w-full">
              <div className="mt-2 mb-6">
                <hr className="border-zinc-800" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6 w-full max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Change Password</h3>
                <div className="flex flex-col gap-5 md:flex-row md:gap-8">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      name="currentPassword"
                      type="password"
                      placeholder="Current password"
                      className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                      value={optimisticState.currentPassword}
                      onChange={e => handleOptimisticChange("currentPassword", e.target.value)}
                    />
                    {currentPasswordError && (
                      <span className="text-xs text-red-500 mt-1">{currentPasswordError}</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      placeholder="New password"
                      className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                      value={optimisticState.newPassword}
                      onChange={e => handleOptimisticChange("newPassword", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                      value={optimisticState.confirmPassword}
                      onChange={e => handleOptimisticChange("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>
                {passwordError && (
                  <div className="text-xs text-red-500 mt-2 text-center">{passwordError}</div>
                )}
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
              disabled={
                isPending ||
                !isChanged ||
                ((!!passwordError || !!currentPasswordError) && !!(optimisticState.currentPassword || optimisticState.newPassword || optimisticState.confirmPassword)) ||
                ((!!usernameError || !!emailError) && !!(optimisticState.username || optimisticState.email))
              }
            >
              {isPending ? <Info className="animate-spin w-4 h-4 mr-2 inline" /> : null}
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
