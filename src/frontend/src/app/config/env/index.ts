import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  API_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const _env = envSchema.safeParse({
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  API_URL: process.env.API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.table(_env.error.flatten().fieldErrors);
  throw new Error("❌ Environment validation failed.");
}

export const env = _env.data;
