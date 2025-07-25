"use server";

import { env } from "@/config/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJwt } from "@/lib/auth/helpers";
import { Endpoints } from "@/config/constants";

export async function updateMe({ username, email }: { username?: string; email?: string }) {
  const jwt = await getJwt();

  const body: Record<string, string> = {};
  if (username !== undefined) body.username = username;
  if (email !== undefined) body.email = email;

  const res = await fetch(Endpoints.UPDATE_ME, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
  
  const newJwt = data.token || null;
  return {
    ...data,
    newJwt: newJwt,
  };
}

export async function updatePassword(currentPassword: string, newPassword: string, newJwt?: string | null) {
  const jwt = await getJwt();
  const res = await fetch(Endpoints.UPDATE_PASSWORD, {
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
  
  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) {
      if (res.status === 403) throw new Error("Your session is invalid. Please log in again.");
      throw new Error("Failed to update password");
    }
    data = {};
  }
  
  if (!res.ok) {
    throw new Error(data.message || "Failed to update password");
  }

  const finalNewJwt = data.token || null;

  return {
    ...data,
    newJwt: finalNewJwt
  };
} 