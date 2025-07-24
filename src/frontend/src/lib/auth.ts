import { env } from "@/config/env";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) return null;
        const data = await res.json();

        return {
          id: data.user.id || data.email,
          username: data.user.username,
          email: data.user.email,
          roles: data.user.roles,
          jwt: data.token,
          refreshToken: data.refreshToken
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 3,
    updateAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.jwt = (user as any).jwt ?? undefined;
        token.refreshToken = (user as any).refreshToken ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.jwt = (token.jwt as string) ?? "";
        session.refreshToken = (token.refreshToken as string) ?? "";
        // Remove from user object to avoid duplication
        if (session.user) {
          delete (session.user as any).jwt;
          delete (session.user as any).refreshToken;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
