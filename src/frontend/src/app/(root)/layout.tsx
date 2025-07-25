import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "next-auth";

let dataAdmin = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Team",
      url: "/team",
      icon: "users",
    },
    // {
    //   title: "Lifecycle",
    //   url: "#",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: IconFolder,
    // },
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
    {
      title: "Settings",
      url: "#",
      icon: "settings",
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
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

let dataUser = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
    },
  ]
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {
        session.user.roles.includes("ADMIN") ? (
          <AppSidebar variant="inset" user={user} data={dataAdmin} />
        ) : (
          <AppSidebar variant="inset" user={user} data={dataUser} />
        )
      }
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
};

export default DashboardLayout;
