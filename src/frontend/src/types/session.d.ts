import { DefaultSession } from "next-auth";

type User = {
  username: string ;
  email: string ;
  roles: string[];
  avatar: string;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    jwt: string;
    refreshToken: string;
  }
}
