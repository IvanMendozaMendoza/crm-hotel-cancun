import { env } from "@/config/env";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { revalidatePath } from "next/cache";
import type { AuthApiResponse, AuthCredentials, AuthUser } from "./types";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            } satisfies AuthCredentials),
          });

          if (!res.ok) return null;
          
          const data: AuthApiResponse = await res.json();
          revalidatePath("/**/*");

          const userPayload: AuthUser = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            roles: data.user.roles,
            jwt: data.token,
            refreshToken: data.refreshToken,
          };

          return userPayload;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.user = {
          id: authUser.id,
          username: authUser.username,
          email: authUser.email,
          roles: authUser.roles,
        };
        token.jwt = authUser.jwt;
        token.refreshToken = authUser.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...token.user,
          id: token.user.id,
          username: token.user.username,
          email: token.user.email,
          roles: token.user.roles,
        };
        session.jwt = token.jwt;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Export types for use in other parts of the application
export type { AuthApiResponse, AuthCredentials, AuthUser };
