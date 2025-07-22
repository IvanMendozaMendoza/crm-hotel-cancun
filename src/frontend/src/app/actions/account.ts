"use server";

import { env } from "@/config/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateName(username: string) {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt;
  console.log(jwt, session);
  if (!jwt) throw new Error("Not authenticated");
  const res = await fetch(`${env.API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({ username }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update name");
  }
  return await res.json();
}

export async function updateEmail(email: string) {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt;
  if (!jwt) throw new Error("Not authenticated");
  const res = await fetch(`${env.API_URL}/users/me/email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update email");
  }
  return await res.json();
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
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update password");
  }
  return await res.json();
} 