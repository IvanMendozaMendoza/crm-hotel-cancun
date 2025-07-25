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
            <DialogDescription>
              Fill in the details to create a new user account.
              <br />
              <br />
              <span className="text-red-500">DOESNT WORK YET</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Full Name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Confirm password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <hr className="border-zinc-800 my-4" />
            <div className="grid gap-3">
              <Label htmlFor="roles">Roles</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
