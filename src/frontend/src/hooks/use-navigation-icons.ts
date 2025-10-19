"use client";

import { useMemo } from "react";
import {
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
  IconDashboard,
  IconCamera,
} from "@tabler/icons-react";
import type { NavigationIconMap } from "@/types/navigation";

export const useNavigationIcons = () => {
  const iconMap = useMemo(
    (): NavigationIconMap => ({
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
      camera: IconCamera,
    }),
    []
  );

  const getIcon = (icon?: string | React.ComponentType<{ className?: string }>) => {
    if (!icon) return null;
    
    // If icon is already a React component, return it directly
    if (typeof icon === 'function') {
      return icon;
    }
    
    // If icon is a string, look it up in the icon map
    if (typeof icon === 'string') {
      return iconMap[icon as keyof NavigationIconMap] || null;
    }
    
    return null;
  };

  return {
    iconMap,
    getIcon,
  };
};
