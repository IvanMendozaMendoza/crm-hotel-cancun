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
} from "@tabler/icons-react";
import type { NavigationIconMap } from "@/types/navigation";

export const useNavigationIcons = () => {
  const iconMap = useMemo(
    (): NavigationIconMap => ({
      dashboard: null, // No direct icon for dashboard, handled by default
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
    }),
    []
  );

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    return iconMap[iconName as keyof NavigationIconMap] || null;
  };

  return {
    iconMap,
    getIcon,
  };
};
