import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import React from "react";

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
  const isChanged =
    formState.name !== user.name ||
    (user.role === "ADMIN" && formState.email !== (user.email || "")) ||
    formState.currentPassword !== "" ||
    formState.newPassword !== "" ||
    formState.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsPending(false);
    toast.success("Account settings updated successfully.");
    onOpenChange(false);
  };

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
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !isChanged}>
              {isPending ? <Info className="animate-spin w-4 h-4 mr-2 inline" /> : null}
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
