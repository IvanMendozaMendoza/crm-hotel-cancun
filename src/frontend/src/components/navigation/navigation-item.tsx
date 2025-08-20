"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigationItemRendering } from "@/hooks/use-shared-navigation";
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
  const { getNavigationItemClasses, getExpansionIndicatorClasses } = useNavigationItemRendering();

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
        className={getNavigationItemClasses(isActive, hasSubItems)}
      >
        {hasSubItems ? (
          <div className="flex items-center gap-2 w-full mt-2">
            {Icon && <Icon className="size-5"/>}
            <span className="flex-1">{item.title}</span>
            <div className={getExpansionIndicatorClasses(isExpanded)}>
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