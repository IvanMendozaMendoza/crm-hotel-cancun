"use client";

import React from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { NavigationItem } from "@/types/navigation";

interface NavigationSubItemsProps {
  item: NavigationItem;
  isExpanded: boolean;
  isSubItemActive: (url: string) => boolean;
  onNavigationClick: () => void;
}

export const NavigationSubItems = ({
  item,
  isExpanded,
  isSubItemActive,
  onNavigationClick,
}: NavigationSubItemsProps) => {
  if (!item.items || item.items.length === 0) return null;

  return (
    <div 
      className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}
    >
      <div className="ml-6 border-l border-zinc-700 dark:border-zinc-800 mt-2">
        {item.items.map((subItem, index) => {
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
                className={`transition-all duration-200 ease-in-out ${
                  isSubActive 
                    ? "bg-zinc-800/70 text-white hover:bg-zinc-700/80 hover:text-white" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 hover:text-zinc-800 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                }`}
              >
                <Link 
                  href={subItem.url} 
                  className="flex items-center gap-2 text-sm" 
                  onClick={onNavigationClick}
                >
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </div>
    </div>
  );
}; 