"use client"

import {
  IconCirclePlusFilled,
  IconMail,
  IconDashboard,
  IconUsers,
  IconSettings,
  IconHelp,
  IconReport,
  IconListDetails,
  IconSearch,
  IconChartBar,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: string // now a string identifier
  }[]
}) {
  const iconMap = {
    dashboard: IconDashboard,
    users: IconUsers,
    settings: IconSettings,
    help: IconHelp,
    report: IconReport,
    list: IconListDetails,
    search: IconSearch,
    chart: IconChartBar,
    database: IconDatabase,
    fileai: IconFileAi,
    filedesc: IconFileDescription,
    fileword: IconFileWord,
    folder: IconFolder,
  } as const;
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              onClick={()=>{redirect("/upload")}}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Upload file</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <hr className="bg-zinc-700 dark:border-zinc-800" />
          {items.map((item) => {
            const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url} className="flex items-center gap-2">
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
