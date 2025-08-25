"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import type {
  NavigationItemType,
  NavigationState,
  NavigationActions,
} from "@/types/navigation";

export const useNavigation = (items: NavigationItemType[]) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Memoized state to avoid unnecessary recalculations
  const navigationState = useMemo((): NavigationState => {
    let activeItem: string | null = null;
    let activeSubItem: string | null = null;

    // Find active item and sub-item
    for (const item of items) {
      if ('url' in item && pathname === item.url) {
        activeItem = item.url;
        break;
      }

      if (item.items) {
        for (const subItem of item.items) {
          if (pathname === subItem.url) {
            activeSubItem = subItem.url;
            activeItem = subItem.url;
            break;
          }
        }
        if (activeSubItem) break;
      }
    }

    return {
      expandedItems,
      activeItem,
      activeSubItem,
    };
  }, [items, pathname, expandedItems]);

  // Actions
  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  }, []);

  const setActiveItem = useCallback(() => {
    // This could be used for programmatic navigation
    // For now, it's handled by the pathname
  }, []);

  const setActiveSubItem = useCallback(() => {
    // This could be used for programmatic navigation
    // For now, it's handled by the pathname
  }, []);

  const handleNavigationClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  // Helper functions
  const isExpanded = useCallback(
    (title: string) => {
      return expandedItems.includes(title);
    },
    [expandedItems]
  );

  const isItemActive = useCallback(
    (url: string) => {
      return (
        navigationState.activeItem === url && !navigationState.activeSubItem
      );
    },
    [navigationState.activeItem, navigationState.activeSubItem]
  );

  const isSubItemActive = useCallback(
    (url: string) => {
      return navigationState.activeSubItem === url;
    },
    [navigationState.activeSubItem]
  );

  const shouldExpandParent = useCallback(
    (item: NavigationItemType) => {
      if (!item.items) return false;
      return item.items.some((subItem) => isSubItemActive(subItem.url));
    },
    [isSubItemActive]
  );

  const getExpandedState = useCallback(
    (item: NavigationItemType) => {
      return isExpanded(item.title) || shouldExpandParent(item);
    },
    [isExpanded, shouldExpandParent]
  );

  // Helper to check if a parent item should be highlighted
  const isParentActive = useCallback(
    (item: NavigationItemType) => {
      if (!item.items) return false;
      return item.items.some((subItem) => isSubItemActive(subItem.url));
    },
    [isSubItemActive]
  );

  const actions: NavigationActions = {
    toggleExpanded,
    setActiveItem,
    setActiveSubItem,
    handleNavigationClick,
  };

  return {
    state: navigationState,
    actions,
    helpers: {
      isExpanded,
      isItemActive,
      isSubItemActive,
      shouldExpandParent,
      getExpandedState,
      isParentActive,
    },
  };
};
