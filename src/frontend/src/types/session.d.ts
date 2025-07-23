import { DefaultSession } from "next-auth";

type User = {
  id?: string;
  username: string ;
  email: string ;
  roles: string[];
  jwt:string;
  refreshToken:string;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    jwt: string;
    refreshToken: string;
  }
}
