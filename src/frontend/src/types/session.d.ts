import { DefaultSession } from "next-auth";

type User = {
  username: string ;
  email: string ;
  backendJwt?: string;
  role: string;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    backendJwt?: string;
  }
  interface User {
    backendJwt?: string;
  }
}
