import { env } from "@/app/config/env";
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
          credentials: "include",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) return null;
        const user = await res.json();
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user = token.user as any;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};
