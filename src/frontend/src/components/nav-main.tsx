"use client";

import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/hooks/use-navigation";
import { useNavigationIcons } from "@/hooks/use-navigation-icons";
import { 
  NavigationItemComponent, 
  NavigationSubItems, 
  QuickCreateButton 
} from "@/components/navigation";
import type { NavigationItem } from "@/types/navigation";

interface NavMainProps {
  items: NavigationItem[];
}

export function NavMain({ items }: NavMainProps) {
  const { actions, helpers } = useNavigation(items);
  const { getIcon } = useNavigationIcons();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <QuickCreateButton />

        <SidebarMenu>
          <hr className="bg-zinc-700 dark:border-zinc-800 mb-2" />
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            const hasSubItems = Boolean(item.items && item.items.length > 0);
            const expanded = helpers.getExpandedState(item);
            // Parent items (dropdown triggers) are never highlighted - only actual page items get highlighted
            const isActive = false; // Parent items are never active

            return (
              <div key={item.title}>
                <NavigationItemComponent
                  item={item}
                  icon={Icon}
                  isExpanded={expanded}
                  isActive={isActive}
                  hasSubItems={hasSubItems}
                  onToggle={actions.toggleExpanded}
                  onNavigationClick={actions.handleNavigationClick}
                />
                
                <NavigationSubItems
                  item={item}
                  isExpanded={expanded}
                  isSubItemActive={helpers.isSubItemActive}
                  onNavigationClick={actions.handleNavigationClick}
                />
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
