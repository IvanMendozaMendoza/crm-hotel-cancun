import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Call your Spring Boot backend
        const res = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important: allow cookies to be set
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) return null;
        const user = await res.json();
        // user = { id, username, email, roles }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt", // or "database" if you want, but "jwt" is fine for this
  },
  callbacks: {
    async session({ session, token, user }) {
      // Attach user info to session
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
    signIn: "/login", // Your custom login page if you have one
  },
};
