"use client";

import React from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { NavigationItem } from "@/types/navigation";

interface NavigationItemProps {
  item: NavigationItem;
  icon: React.ComponentType<{ className?: string }> | null;
  isExpanded: boolean;
  isActive: boolean;
  hasSubItems: boolean;
  onToggle: (title: string) => void;
  onNavigationClick: () => void;
}

export const NavigationItemComponent = ({
  item,
  icon: Icon,
  isExpanded,
  isActive,
  hasSubItems,
  onToggle,
  onNavigationClick,
}: NavigationItemProps) => {
  const handleToggle = () => {
    if (hasSubItems) {
      onToggle(item.title);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        tooltip={item.title} 
        asChild={!hasSubItems}
        onClick={hasSubItems ? handleToggle : undefined}
        className={`${hasSubItems ? "cursor-pointer" : ""} transition-all duration-100 ease-in-out hover:bg-zinc-800/50 ${
          isActive ? "bg-zinc-800/70 text-white" : ""
        }`}
      >
        {hasSubItems ? (
          <div className="flex items-center gap-2 w-full mt-2">
            {Icon && <Icon className="size-5"/>}
            <span className="flex-1">{item.title}</span>
            <div className={`transition-transform duration-200 ease-in-out ${
              isExpanded ? 'rotate-90' : 'rotate-0'
            }`}>
              <IconChevronRight className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <Link href={item.url} className="flex items-center gap-2" onClick={onNavigationClick}>
            {Icon && <Icon />}
            <span>{item.title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}; 