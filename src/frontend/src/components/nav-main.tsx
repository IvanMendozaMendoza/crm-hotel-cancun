"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  IconCirclePlusFilled,
  IconBell,
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
  useSidebar,
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
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

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

  // Function to handle navigation clicks and auto-close sidebar on mobile/tablet
  const handleNavigationClick = () => {
    // Close sidebar on mobile/tablet viewports
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Function to check if an item is active
  const isItemActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    // Only highlight parent if it's the exact match, not when a sub-route is active
    // Also check that no sub-item is currently active for this parent
    const hasActiveSubItem = items.find(item => 
      item.url === url && item.items?.some(subItem => pathname === subItem.url)
    );
    return pathname === url && !hasActiveSubItem;
  };

  // Function to check if a sub-item is active
  const isSubItemActive = (url: string) => {
    return pathname === url;
  };

  // Function to check if a parent item should be expanded due to active child
  const shouldExpandParent = (item: any) => {
    if (!item.items) return false;
    return item.items.some((subItem: any) => isSubItemActive(subItem.url));
  };

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
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu  >
          <hr className="bg-zinc-700 dark:border-zinc-800 mb-2" />
          {items.map((item) => {
            const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
            const hasSubItems = item.items && item.items.length > 0;
            const expanded = isExpanded(item.title) || shouldExpandParent(item);
            const isActive = isItemActive(item.url);

            return (
              <div key={item.title} >
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild={!hasSubItems}
                    onClick={hasSubItems ? () => toggleExpanded(item.title) : undefined}
                    className={`${hasSubItems ? "cursor-pointer" : ""} transition-all duration-100 ease-in-out hover:bg-zinc-800/50 ${
                      isActive ? "bg-zinc-800/70 text-white" : ""
                    }`}
                  >
                    {hasSubItems ? (
                      <div className="flex items-center gap-2 w-full mt-2">
                        {Icon && <Icon className="size-5"/>}
                        <span className="flex-1">{item.title}</span>
                        <div className={`transition-transform duration-200 ease-in-out ${
                          expanded ? 'rotate-90' : 'rotate-0'
                        }`}>
                          <IconChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-2" onClick={handleNavigationClick}>
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Sub-items */}
                {hasSubItems && (
                  <div 
                    className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      expanded 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-6 border-l border-zinc-700 dark:border-zinc-800 mt-2">
                      {item.items?.map((subItem, index) => {
                        const isSubActive = isSubItemActive(subItem.url);
                        return (
                          <SidebarMenuItem 
                            key={subItem.title} 
                            className="ml-2"
                            style={{
                              transitionDelay: `${index * 30}ms`
                            }}
                          >
                            <SidebarMenuButton 
                              tooltip={subItem.title} 
                              asChild
                              className={`${isSubActive ? "bg-zinc-800/70 text-white" : ""}`}
                            >
                              <Link href={subItem.url} className="flex items-center gap-2 text-sm" onClick={handleNavigationClick}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
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
