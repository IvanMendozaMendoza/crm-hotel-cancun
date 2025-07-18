import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log(session);
  
  if (!session) redirect("/login");

  return (
    <div>{session ? `Hello ${session.user?.username}` : "Not signed in"}</div>
  );
}
