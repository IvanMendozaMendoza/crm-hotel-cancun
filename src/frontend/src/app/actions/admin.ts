"use server";

import { env } from "@/config/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  const jwt = session?.jwt;

  if (!jwt) throw new Error("Not authenticated");
  const res = await fetch(`${env.API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    cache: 'no-store',
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to get all users");
  }
  return data;
}