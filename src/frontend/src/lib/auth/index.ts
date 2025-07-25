import { env } from "@/config/env";
import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { revalidatePath } from "next/cache";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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

        revalidatePath("/**/*");

        const userPayload: User = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          roles: data.user.roles,
          jwt: data.token,
          refreshToken: data.refreshToken,
        };

        return userPayload;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
        };
        token.jwt = (user as unknown as Session).jwt;
        token.refreshToken = (user as unknown as Session).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as User;
        session.jwt = token.jwt as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
