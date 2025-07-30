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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export const CreateUserDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={() => {}}>
        <DialogContent className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 lg:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the details to create a new user account with appropriate role assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-200">Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Full Name" 
                className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-200">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm Password"
                className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <hr className="border-zinc-800 my-4" />
            <div className="grid gap-3">
              <Label htmlFor="roles">Role Group</Label>
              <Select>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a role group" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectGroup>
                    <SelectLabel className="text-gray-400">Role Groups</SelectLabel>
                    <SelectItem value="admin" className="text-white hover:bg-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        Administrators
                      </div>
                    </SelectItem>
                    <SelectItem value="content-manager" className="text-white hover:bg-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Content Managers
                      </div>
                    </SelectItem>
                    <SelectItem value="analyst" className="text-white hover:bg-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        Data Analysts
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer" className="text-white hover:bg-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        Viewers
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-800 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
