"use server";

import { getJwt } from "@/lib/auth/helpers";
import { Endpoints } from "@/lib/server-endpoints";

export async function getAllUsers() {
  const jwt = await getJwt();
  const res = await fetch(Endpoints.GET_ALL_USERS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to get all users");
  }
  return data;
}
