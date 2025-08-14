import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">
            General Settings
          </h1>
          <p className="text-gray-400">
            Manage your account profile and preferences.
          </p>
        </div>

        <SettingsForm user={session.user} />
      </div>
    </div>
  );
};

export default SettingsPage;
