"use client";

import React from "react";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export const QuickCreateButton = () => {
  const handleClick = () => {
    redirect("/upload");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton
          tooltip="Quick Create"
          onClick={handleClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        >
          <IconCirclePlusFilled />
          <span>Upload file</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}; 