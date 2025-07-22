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
import { Info } from "lucide-react";

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
  console.log(user)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 lg:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl">
          <DialogHeader className="">
            <DialogTitle>Your Account Settings</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={user.name} />
            </div>
            {user.role === "ADMIN" && (
              <div className="grid gap-3">
                <Label htmlFor="email-1">Email</Label>
                <Input id="email-1" name="email" type="email" defaultValue={user.email || ""} />
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
                  />
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                  />
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-zinc-800 text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
