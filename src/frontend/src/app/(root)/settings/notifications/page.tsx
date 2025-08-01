import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationsForm } from "./notifications-form";

const NotificationsPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Notification Settings</h1>
          <p className="text-gray-400">Manage your notification preferences and communication settings.</p>
        </div>

        <NotificationsForm user={session.user} />
      </div>
    </div>
  );
};

export default NotificationsPage; 