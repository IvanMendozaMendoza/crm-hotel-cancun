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
        console.log("[NextAuth][authorize] backend response:", data);
        // Map backend response to user object and use data.token as backendJwt
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles,
          backendJwt: data.token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60  * 24 * 3,
    updateAge: 60 * 60 * 24
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.backendJwt = (user.backendJwt ?? undefined) as string | undefined;
        console.log("[NextAuth][jwt] token after login:", token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.backendJwt = (token.backendJwt ?? undefined) as string | undefined;
        console.log("[NextAuth][session] session object:", session);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
