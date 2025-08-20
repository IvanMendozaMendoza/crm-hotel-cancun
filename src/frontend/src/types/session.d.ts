import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    id?: string;
    user: User;
    jwt: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    id?: string;
    username: string;
    email: string;
    roles: string[];
    avatar?: string;
    jwt?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id?: string;
      username: string;
      email: string;
      roles: string[];
    };
    jwt: string;
    refreshToken: string;
  }
}