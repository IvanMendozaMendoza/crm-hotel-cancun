import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";

// Add a type for User
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

const fetchUsers = async (backendJwt: string): Promise<User[]> => {
  const res = await fetch(process.env.API_URL + "/users", {
    headers: {
      Authorization: `Bearer ${backendJwt}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const TeamPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // Check for 'ADMIN' in uppercase
  // if (!Array.isArray((session.user as any)?.roles) || !(session.user as any).roles.includes("ADMIN")) redirect("/");
console.log(session.backendJwt)
  let users: User[] = [];
  let error: string | null = null;
  try {
    users = await fetchUsers(session.backendJwt || "");
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="w-full px-4 py-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Team Members</h1>
        <button className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 transition">
          Create User
        </button>
      </div>
      {error ? (
        <div className="text-red-500 bg-zinc-900 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
            <table className="w-full table-fixed text-zinc-200 text-sm">
              <thead>
                <tr className="bg-zinc-950">
                  <th className="px-4 py-3 text-left min-w-[120px]">Username</th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Email</th>
                  <th className="px-4 py-3 text-left min-w-[140px]">Roles</th>
                  <th className="px-4 py-3 text-left min-w-[100px]">Enabled</th>
                  <th className="px-4 py-3 text-left min-w-[160px]">Account Non Expired</th>
                  <th className="px-4 py-3 text-left min-w-[160px]">Account Non Locked</th>
                  <th className="px-4 py-3 text-left min-w-[180px]">Credentials Non Expired</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-zinc-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((user: User) => (
                    <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 transition">
                      <td className="px-4 py-3 break-all min-w-[120px]">{user.username}</td>
                      <td className="px-4 py-3 break-all min-w-[200px]">{user.email}</td>
                      <td className="px-4 py-3 break-all min-w-[140px]">{user.roles.join(", ")}</td>
                      <td className="px-4 py-3 min-w-[100px]">{user.enabled ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 min-w-[160px]">{user.accountNonExpired ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 min-w-[160px]">{user.accountNonLocked ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 min-w-[180px]">{user.credentialsNonExpired ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col gap-4">
            {users.length === 0 ? (
              <div className="text-center text-zinc-500 bg-zinc-900 p-4 rounded-lg">No users found.</div>
            ) : (
              users.map((user: User) => (
                <div key={user.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow flex flex-col gap-2">
                  <div className="font-semibold text-zinc-100">{user.username}</div>
                  <div className="text-zinc-400 text-xs break-all">{user.email}</div>
                  <div className="text-zinc-300 text-xs">Roles: <span className="font-medium">{user.roles.join(", ")}</span></div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">Enabled: {user.enabled ? "Yes" : "No"}</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">Account Non Expired: {user.accountNonExpired ? "Yes" : "No"}</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">Account Non Locked: {user.accountNonLocked ? "Yes" : "No"}</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">Credentials Non Expired: {user.credentialsNonExpired ? "Yes" : "No"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamPage;
