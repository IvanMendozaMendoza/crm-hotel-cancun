"use server";

import { env } from "@/config/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateMe({ username, email }: { username?: string; email?: string }) {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt;
  if (!jwt) throw new Error("Not authenticated");
  const body: any = {};
  if (username !== undefined) body.username = username;
  if (email !== undefined) body.email = email;
  const res = await fetch(`${env.API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  console.log(data)
  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
  return data;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt;
  if (!jwt) throw new Error("Not authenticated");
  const res = await fetch(`${env.API_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      currentPassword,
      password: newPassword,
      passwordConfirm: newPassword,
    }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update password");
  }
  return data;
} 