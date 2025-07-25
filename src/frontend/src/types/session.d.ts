import { DefaultSession } from "next-auth";
declare module "next-auth" {

  interface Session extends DefaultSession {
    id?: string;
    user: User;
    jwt: string;
    refreshToken: string;
  }

  interface User extends AdapterUser {
    id?: string;
    username: string;
    email: string ;
    roles: string[];
    avatar?: string;
    jwt?: string;
    refreshToken?: string;
  }
}