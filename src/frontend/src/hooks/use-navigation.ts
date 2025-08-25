"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import type {
  NavigationItem,
  NavigationState,
  NavigationActions,
} from "@/types/navigation";

export const useNavigation = (items: NavigationItem[]) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Memoized state to avoid unnecessary recalculations
  const navigationState = useMemo((): NavigationState => {
    let activeItem: string | null = null;
    let activeSubItem: string | null = null;

    // Find active item and sub-item
    for (const item of items) {
      if (pathname === item.url) {
        activeItem = item.url;
        break;
      }

      if (item.items) {
        for (const subItem of item.items) {
          if (pathname === subItem.url) {
            activeSubItem = subItem.url;
            activeItem = item.url;
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
      // Check if this item is the active parent (has active sub-item)
      if (navigationState.activeSubItem) {
        // Find the parent item that contains the active sub-item
        const parentItem = items.find(item => 
          item.items?.some(subItem => subItem.url === navigationState.activeSubItem)
        );
        return parentItem?.url === url;
      }
      // If no active sub-item, check if this item is directly active
      return navigationState.activeItem === url;
    },
    [navigationState.activeItem, navigationState.activeSubItem, items]
  );

  const isSubItemActive = useCallback(
    (url: string) => {
      return navigationState.activeSubItem === url;
    },
    [navigationState.activeSubItem]
  );

  const shouldExpandParent = useCallback(
    (item: NavigationItem) => {
      if (!item.items) return false;
      return item.items.some((subItem) => isSubItemActive(subItem.url));
    },
    [isSubItemActive]
  );

  const getExpandedState = useCallback(
    (item: NavigationItem) => {
      return isExpanded(item.title) || shouldExpandParent(item);
    },
    [isExpanded, shouldExpandParent]
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
    },
  };
};
