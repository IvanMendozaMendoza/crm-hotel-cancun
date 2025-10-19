"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavigationSkeletonProps {
  items?: number;
  showQuickCreate?: boolean;
  className?: string;
}

export const NavigationSkeleton = ({
  items = 5,
  showQuickCreate = true,
  className,
}: NavigationSkeletonProps) => {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2">
        {showQuickCreate && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        <SidebarMenu>
          <div className="h-px bg-zinc-700 dark:bg-zinc-800 mb-2" />
          {Array.from({ length: items }).map((_, index) => (
            <div key={index}>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 w-full p-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </SidebarMenuItem>
              
              {/* Occasionally show sub-items */}
              {index % 3 === 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  <div className="ml-2">
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}; 