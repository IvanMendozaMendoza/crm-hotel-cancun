import React from "react";
import CreateUserDialogTrigger from "../../../components/create-user-dialog-trigger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAllUsers } from "@/app/actions/admin";

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

const TeamPage = async () => {
  let users: User[] = [];
  let error: string | null = null;
  try {
    const res = await getAllUsers();
    users = res.users;
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="w-full px-2 sm:px-4 py-6 flex flex-col gap-8">
      <div className="flex items-center justify-between max-w-2xl px-2 mb-4">
        <h2 className="text-xl font-bold text-card-foreground">Team Members</h2>
        <CreateUserDialogTrigger />
      </div>
      <div className="w-full max-w-2xl mx-auto bg-card dark:bg-zinc-900 border border-border rounded-xl p-4 sm:p-6 shadow flex flex-col gap-4">
        {users.length === 0 ? (
          <div className="text-center text-muted-foreground bg-card p-4 rounded-lg">
            No users found.
          </div>
        ) : (
          users.map((user: User) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4  rounded-lg px-4 py-3 transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 ">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} alt={user.username} />
                  <AvatarFallback>
                    {user.username[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-card-foreground truncate">
                    {user.username}
                  </span>
                  <span className="text-muted-foreground text-xs truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Select defaultValue={"USER"}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {user.roles.map((role) => (
                        <SelectItem key={role} value={role}>{role.charAt(0) + role.slice(1).toLowerCase()}</SelectItem>
                      ))} */}
                    {/* Optionally add more roles */}
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="DEVELOPER">Developer</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        )}
      </div>

      {
        <div className="w-auto mx-auto bg-card dark:bg-zinc-900 border border-border rounded-xl p-4 sm:p-6 shadow flex flex-col gap-4">
          <h1>Users data</h1>
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      }
    </div>
  );
};

export default TeamPage;
