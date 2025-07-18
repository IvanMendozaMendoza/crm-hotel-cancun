import { DefaultSession } from "next-auth";

type User = {
  username: string ;
  email: string ;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}
