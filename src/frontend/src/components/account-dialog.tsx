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
import { updateName, updateEmail, updatePassword } from "@/app/actions/account";

export const AccountDialog = ({
  open,
  onOpenChange,
  user
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { name: string; email?: string, role: string };
}) => {
  const [isPending, setIsPending] = React.useState(false);
  const [formState, setFormState] = React.useState({
    name: user.name,
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = React.useState("");
  const [currentPasswordError, setCurrentPasswordError] = React.useState("");

  const isChanged =
    formState.name !== user.name ||
    (user.role === "ADMIN" && formState.email !== (user.email || "")) ||
    formState.currentPassword !== "" ||
    formState.newPassword !== "" ||
    formState.confirmPassword !== "";

  // Zod password schema
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Remove the old API update functions

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setPasswordError("");
    setCurrentPasswordError("");
    try {
      // Password validation (if password fields are filled)
      if (
        formState.currentPassword ||
        formState.newPassword ||
        formState.confirmPassword
      ) {
        const result = passwordSchema.safeParse({
          currentPassword: formState.currentPassword,
          newPassword: formState.newPassword,
          confirmPassword: formState.confirmPassword,
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
      // Track which updates are needed
      const updatePromises = [];
      if (formState.name !== user.name) {
        updatePromises.push(updateName(formState.name));
      }
      if (user.role === "ADMIN" && formState.email !== (user.email || "")) {
        updatePromises.push(updateEmail(formState.email));
      }
      if (
        formState.currentPassword &&
        formState.newPassword &&
        formState.newPassword === formState.confirmPassword
      ) {
        updatePromises.push(updatePassword(formState.currentPassword, formState.newPassword));
      }
      await Promise.all(updatePromises);
      toast.success("Account settings updated successfully.");
      onOpenChange(false);
    } catch (err: any) {
      // Show specific error messages
      if (err.message?.toLowerCase().includes("password")) {
        setCurrentPasswordError(err.message);
      } else if (err.message?.toLowerCase().includes("email")) {
        setPasswordError("");
        setCurrentPasswordError("");
        toast.error(err.message);
      } else if (err.message?.toLowerCase().includes("name")) {
        setPasswordError("");
        setCurrentPasswordError("");
        toast.error(err.message);
      } else {
        toast.error(err.message || "Failed to update account settings.");
      }
    } finally {
      setIsPending(false);
    }
  };

  // Clear password errors on password field change
  React.useEffect(() => {
    setPasswordError("");
    setCurrentPasswordError("");
  }, [formState.currentPassword, formState.newPassword, formState.confirmPassword]);

  // Reset password fields when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormState(s => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordError("");
      setCurrentPasswordError("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 lg:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Your Account Settings</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} />
            </div>
            {user.role === "ADMIN" && (
              <div className="grid gap-3">
                <Label htmlFor="email-1">Email</Label>
                <Input id="email-1" name="email" type="email" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Info className="ml-2 w-3 h-3 text-muted-foreground" aria-hidden="true" />
                  We'll send a confirmation email to this address to validate the changes
                </span>
              </div>
            )}
            <div className="lg:col-span-2">
              <hr className="border-zinc-800 my-4" />
              {/* Password Change Section */}
              <div className="grid gap-3 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <Label className="text-zinc-200 text-sm font-medium mb-2">
                  Change Password
                </Label>
                <div className="grid gap-2 lg:grid-cols-3 lg:gap-4">
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    placeholder="Current password"
                    className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                    value={formState.currentPassword}
                    onChange={e => setFormState(s => ({ ...s, currentPassword: e.target.value }))}
                  />
                  <div className="text-xs text-red-500 min-h-[20px] lg:col-span-2">
                    {currentPasswordError}
                  </div>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                    value={formState.newPassword}
                    onChange={e => setFormState(s => ({ ...s, newPassword: e.target.value }))}
                  />
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                    value={formState.confirmPassword}
                    onChange={e => setFormState(s => ({ ...s, confirmPassword: e.target.value }))}
                  />
                </div>
                {passwordError && (
                  <div className="text-xs text-red-500 mt-1">{passwordError}</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={
              isPending ||
              !isChanged ||
              // Only block submit if password error AND user is trying to change password
              ((!!passwordError || !!currentPasswordError) && !!(formState.currentPassword || formState.newPassword || formState.confirmPassword))
            }>
              {isPending ? <Info className="animate-spin w-4 h-4 mr-2 inline" /> : null}
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
