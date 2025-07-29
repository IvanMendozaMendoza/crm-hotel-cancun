"use client"

import { useState } from "react";
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
  IconChevronDown,
  IconChevronRight,
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
    icon?: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isExpanded = (title: string) => expandedItems.includes(title);

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
            const hasSubItems = item.items && item.items.length > 0;
            const expanded = isExpanded(item.title);

            return (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild={!hasSubItems}
                    onClick={hasSubItems ? () => toggleExpanded(item.title) : undefined}
                    className={hasSubItems ? "cursor-pointer" : ""}
                  >
                    {hasSubItems ? (
                      <div className="flex items-center gap-2 w-full">
                        {Icon && <Icon />}
                        <span className="flex-1">{item.title}</span>
                        {expanded ? (
                          <IconChevronDown className="h-4 w-4" />
                        ) : (
                          <IconChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-2">
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Sub-items */}
                {hasSubItems && expanded && (
                  <div className="ml-6 border-l border-zinc-700 dark:border-zinc-800">
                    {item.items!.map((subItem) => (
                      <SidebarMenuItem key={subItem.title} className="ml-2">
                        <SidebarMenuButton tooltip={subItem.title} asChild>
                          <Link href={subItem.url} className="flex items-center gap-2 text-sm">
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
