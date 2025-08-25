import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SecurityForm } from "./security-form";

const SecurityPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Security Settings
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Manage your account security and authentication settings.
          </p>
        </div>

        <SecurityForm user={session.user} />
      </div>
    </div>
  );
};

export default SecurityPage;
