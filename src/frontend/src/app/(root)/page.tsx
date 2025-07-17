import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log(session)

  return <div>{session ? `Hello ${session.user?.username}` : "Not signed in"}</div>;
}
