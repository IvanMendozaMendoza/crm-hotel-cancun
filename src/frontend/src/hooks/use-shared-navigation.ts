"use client";

import { useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { ANIMATION } from "@/lib/constants";

/**
 * Shared navigation utilities and patterns used across navigation components
 * 
 * This hook provides common navigation functionality including:
 * - Automatic sidebar management on mobile devices
 * - Consistent navigation click handling
 * - URL routing with sidebar state management
 * 
 * @example
 * ```tsx
 * const { handleNavigationClick, isMobile } = useSharedNavigation();
 * 
 * return (
 *   <button onClick={() => handleNavigationClick('/dashboard')}>
 *     Navigate to Dashboard
 *   </button>
 * );
 * ```
 */
export const useSharedNavigation = () => {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();

  /**
   * Handle navigation clicks with automatic sidebar management
   * 
   * This function handles navigation clicks and automatically manages sidebar state:
   * - Navigates to the specified URL if provided
   * - Closes the sidebar on mobile/tablet viewports for better UX
   * 
   * @param url - Optional URL to navigate to. If not provided, only sidebar management occurs
   * 
   * @example
   * ```tsx
   * // Navigate to URL and close sidebar on mobile
   * handleNavigationClick('/dashboard');
   * 
   * // Just close sidebar without navigation
   * handleNavigationClick();
   * ```
   */
  const handleNavigationClick = useCallback((url?: string) => {
    // Navigate to URL if provided
    if (url) {
      router.push(url);
    }
    
    // Close sidebar on mobile/tablet viewports
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile, router]);

  /**
   * Create a navigation click handler for a specific URL
   * 
   * This is useful when you need to create a click handler that will be passed
   * to child components or event handlers.
   * 
   * @param url - The URL to navigate to when the handler is called
   * @returns A function that can be used as an event handler
   * 
   * @example
   * ```tsx
   * const dashboardHandler = createNavigationHandler('/dashboard');
   * 
   * return <button onClick={dashboardHandler}>Dashboard</button>;
   * ```
   */
  const createNavigationHandler = useCallback((url: string) => {
    return () => handleNavigationClick(url);
  }, [handleNavigationClick]);

  /**
   * Handle link clicks with automatic sidebar management
   * 
   * This function is specifically designed for anchor tags and Link components
   * where navigation is handled by the browser/Next.js router. It only manages
   * sidebar state without programmatic navigation.
   * 
   * @example
   * ```tsx
   * return (
   *   <Link href="/dashboard" onClick={handleLinkClick}>
   *     Dashboard
   *   </Link>
   * );
   * ```
   */
  const handleLinkClick = useCallback(() => {
    // Close sidebar on mobile/tablet viewports
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return {
    handleNavigationClick,
    createNavigationHandler,
    handleLinkClick,
    isMobile,
    setOpenMobile,
  };
};

/**
 * Common navigation item rendering utilities
 * 
 * This hook provides consistent styling and behavior patterns for navigation items
 * across different components. It centralizes common CSS class generation and
 * animation patterns.
 * 
 * @example
 * ```tsx
 * const { getNavigationItemClasses, getExpansionIndicatorClasses } = useNavigationItemRendering();
 * 
 * const itemClasses = getNavigationItemClasses(isActive, hasSubItems);
 * const indicatorClasses = getExpansionIndicatorClasses(isExpanded);
 * ```
 */
export const useNavigationItemRendering = () => {
  /**
   * Generate consistent CSS classes for navigation items
   * 
   * Creates a standardized set of CSS classes for navigation items that ensures
   * consistent styling, transitions, and interactive states across the application.
   * 
   * @param isActive - Whether the navigation item is currently active/selected
   * @param hasSubItems - Whether the navigation item has expandable sub-items
   * @returns A string of CSS classes for the navigation item
   * 
   * @example
   * ```tsx
   * const classes = getNavigationItemClasses(true, false);
   * // Returns: "transition-all duration-100 ease-in-out hover:bg-zinc-800/50 bg-zinc-800/70 text-white"
   * ```
   */
  const getNavigationItemClasses = useCallback((isActive: boolean, hasSubItems: boolean) => {
    const baseClasses = `transition-all duration-${ANIMATION.FAST} ease-in-out hover:bg-zinc-800/50`;
    const activeClasses = isActive ? "bg-zinc-800/70 text-white" : "";
    const interactiveClasses = hasSubItems ? "cursor-pointer" : "";
    
    return `${baseClasses} ${activeClasses} ${interactiveClasses}`.trim();
  }, []);

  /**
   * Generate consistent CSS classes for expansion indicators
   * 
   * Creates standardized CSS classes for expansion indicators (like chevron arrows)
   * that show whether a navigation item with sub-items is expanded or collapsed.
   * 
   * @param isExpanded - Whether the navigation item is currently expanded
   * @returns A string of CSS classes for the expansion indicator
   * 
   * @example
   * ```tsx
   * const classes = getExpansionIndicatorClasses(true);
   * // Returns: "transition-transform duration-200 ease-in-out rotate-90"
   * ```
   */
  const getExpansionIndicatorClasses = useCallback((isExpanded: boolean) => {
    return `transition-transform duration-${ANIMATION.NORMAL} ease-in-out ${
      isExpanded ? 'rotate-90' : 'rotate-0'
    }`;
  }, []);

  return {
    getNavigationItemClasses,
    getExpansionIndicatorClasses,
  };
};

/**
 * Common sidebar state management patterns
 * 
 * This hook provides consistent sidebar state management across different viewport sizes.
 * It automatically handles the differences between mobile (offcanvas) and desktop
 * (collapsible) sidebar behaviors.
 * 
 * @example
 * ```tsx
 * const { toggleSidebar, closeSidebar, isMobile, isOpen } = useSidebarStateManagement();
 * 
 * return (
 *   <button onClick={toggleSidebar}>
 *     {isOpen ? 'Close' : 'Open'} Sidebar
 *   </button>
 * );
 * ```
 */
export const useSidebarStateManagement = () => {
  const { isMobile, setOpenMobile, state, open, setOpen } = useSidebar();

  /**
   * Toggle sidebar state with mobile/desktop awareness
   * 
   * Automatically determines whether to use mobile or desktop sidebar state
   * management based on the current viewport size.
   * 
   * @example
   * ```tsx
   * <button onClick={toggleSidebar}>
   *   Toggle Sidebar
   * </button>
   * ```
   */
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(!open);
    } else {
      setOpen(!open);
    }
  }, [isMobile, setOpenMobile, setOpen, open]);

  /**
   * Close sidebar with mobile/desktop awareness
   * 
   * Closes the sidebar regardless of current state, using the appropriate
   * method for the current viewport size.
   * 
   * @example
   * ```tsx
   * // Close sidebar when navigation occurs
   * const handleNav = () => {
   *   navigateToPage();
   *   closeSidebar();
   * };
   * ```
   */
  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  }, [isMobile, setOpenMobile, setOpen]);

  /**
   * Open sidebar with mobile/desktop awareness
   * 
   * Opens the sidebar using the appropriate method for the current viewport size.
   * 
   * @example
   * ```tsx
   * // Open sidebar when user clicks menu button
   * <button onClick={openSidebar}>
   *   Open Menu
   * </button>
   * ```
   */
  const openSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(true);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpenMobile, setOpen]);

  return {
    toggleSidebar,
    closeSidebar,
    openSidebar,
    isMobile,
    isOpen: open,
    state,
  };
}; 