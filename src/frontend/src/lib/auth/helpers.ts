import { getServerSession } from "next-auth";
import { authOptions } from ".";

export const getJwt = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  const jwt = session?.jwt;
  if (!jwt) throw new Error("Not authenticated");
  return jwt;
};
