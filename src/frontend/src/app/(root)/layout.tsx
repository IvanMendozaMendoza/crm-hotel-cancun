import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ClientErrorBoundary } from "@/components/error-boundary/client-error-boundary";

import {
  IconHelp,
} from "@tabler/icons-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "next-auth";

const dataAdmin = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: "chart",
      items: [
        {
          title: "Overview",
          url: "/analytics",
        }
      ],
    },
    {
      title: "Team",
      url: "/team",
      icon: "users",
      items: [
        {
          title: "All Users",
          url: "/team",
        },
        {
          title: "User Roles",
          url: "/team/roles",
        },
      ],
    },

    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: "camera",
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: "filedesc",
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: "fileai",
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: "settings",
    // },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: "database",
    },
    {
      name: "Reports",
      url: "#",
      icon: "report",
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: "fileword",
    },
  ],
};

const dataUser = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Documents",
      url: "/documents",
      icon: "folder",
      items: [
        {
          title: "My Files",
          url: "/documents",
        },
        {
          title: "Shared",
          url: "/documents/shared",
        },
        {
          title: "Recent",
          url: "/documents/recent",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
      ],
    },
  ],
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = {
    username: session.user.username,
    email: session.user.email,
    roles: session.user.roles,
    avatar: "/avatars/shadcn.jpg", // TODO: change to user avatar
  };

  return (
    <ClientErrorBoundary>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        {session.user.roles.includes("ADMIN") ? (
          <AppSidebar variant="inset" user={user} data={dataAdmin} />
        ) : (
          <AppSidebar variant="inset" user={user} data={dataUser} />
        )}
        <SidebarInset>
          <SiteHeader />
          <ClientErrorBoundary>
            {children}
          </ClientErrorBoundary>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ClientErrorBoundary>
  );
};

export default DashboardLayout;
