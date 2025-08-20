/**
 * Application-wide constants
 * 
 * Centralized location for magic numbers, dimensions, and configuration values.
 * This file serves as a single source of truth for all application constants,
 * making it easier to maintain, update, and reuse values across components.
 * 
 * @example
 * ```tsx
 * import { SIDEBAR, ANIMATION, VALIDATION } from '@/lib/constants';
 * 
 * // Use sidebar dimensions
 * const sidebarStyle = { width: SIDEBAR.WIDTH };
 * 
 * // Use animation durations
 * const transitionClass = `transition-all duration-${ANIMATION.NORMAL}`;
 * 
 * // Use validation rules
 * if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
 *   throw new Error('Password too short');
 * }
 * ```
 */

/**
 * Sidebar dimensions and sizing constants
 * 
 * Defines the standard widths for the application sidebar in different states:
 * - Default: Standard sidebar width for desktop
 * - Mobile: Wider sidebar for mobile devices (better touch targets)
 * - Icon: Collapsed sidebar showing only icons
 */
export const SIDEBAR = {
  /** Standard sidebar width for desktop view */
  WIDTH: "16rem",
  /** Mobile sidebar width (wider for better touch interaction) */
  WIDTH_MOBILE: "18rem",
  /** Collapsed sidebar width showing only icons */
  WIDTH_ICON: "3rem",
} as const;

/**
 * Animation duration constants
 * 
 * Standardized animation durations for consistent user experience across
 * the application. These values are used in CSS transitions and animations.
 */
export const ANIMATION = {
  /** Fast animations (100ms) - for subtle interactions */
  FAST: "100ms",
  /** Normal animations (200ms) - for standard transitions */
  NORMAL: "200ms",
  /** Slow animations (300ms) - for complex state changes */
  SLOW: "300ms",
  /** Very slow animations (500ms) - for major layout changes */
  VERY_SLOW: "500ms",
} as const;

/**
 * Z-index layer constants
 * 
 * Defines the stacking order for different UI elements to ensure
 * proper layering and prevent z-index conflicts.
 */
export const Z_INDEX = {
  /** Dropdown menus and popovers */
  DROPDOWN: 1000,
  /** Modal dialogs and overlays */
  MODAL: 2000,
  /** Tooltips and floating elements */
  TOOLTIP: 3000,
  /** Notifications and toasts */
  NOTIFICATION: 4000,
} as const;

/**
 * Responsive breakpoint constants
 * 
 * Standard breakpoints for responsive design. These values are used
 * in CSS media queries and JavaScript responsive logic.
 * 
 * @example
 * ```tsx
 * import { BREAKPOINTS } from '@/lib/constants';
 * 
 * const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
 * const isTablet = window.innerWidth >= BREAKPOINTS.MOBILE && 
 *                  window.innerWidth < BREAKPOINTS.TABLET;
 * ```
 */
export const BREAKPOINTS = {
  /** Mobile breakpoint (768px) */
  MOBILE: 768,
  /** Tablet breakpoint (1024px) */
  TABLET: 1024,
  /** Desktop breakpoint (1280px) */
  DESKTOP: 1280,
  /** Wide desktop breakpoint (1536px) */
  WIDE: 1536,
} as const;

/**
 * API configuration constants
 * 
 * Centralized API settings including base URLs, timeouts, and retry logic.
 * These values can be overridden by environment variables.
 */
export const API = {
  /** Base URL for API requests */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  /** Request timeout in milliseconds */
  TIMEOUT: 30000,
  /** Maximum number of retry attempts for failed requests */
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Pagination default values
 * 
 * Standard pagination settings used across data tables and lists.
 * These values provide consistent pagination behavior throughout the app.
 */
export const PAGINATION = {
  /** Default number of items per page */
  DEFAULT_PAGE_SIZE: 10,
  /** Maximum allowed items per page */
  MAX_PAGE_SIZE: 100,
  /** Available page size options for user selection */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Form validation rules and constraints
 * 
 * Standard validation rules for form inputs including length limits,
 * file size restrictions, and other validation constraints.
 * 
 * @example
 * ```tsx
 * import { VALIDATION } from '@/lib/constants';
 * 
 * const validatePassword = (password: string) => {
 *   if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
 *     return 'Password must be at least 8 characters';
 *   }
 *   if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
 *     return 'Password must be less than 128 characters';
 *   }
 *   return null;
 * };
 * ```
 */
export const VALIDATION = {
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
  /** Maximum password length */
  MAX_PASSWORD_LENGTH: 128,
  /** Minimum username length */
  MIN_USERNAME_LENGTH: 3,
  /** Maximum username length */
  MAX_USERNAME_LENGTH: 50,
  /** Maximum file upload size (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
} as const;

/**
 * Theme configuration constants
 * 
 * Default theme settings and storage keys for theme management.
 */
export const THEME = {
  /** Default theme when none is specified */
  DEFAULT: "dark",
  /** Local storage key for theme preference */
  STORAGE_KEY: "theme",
} as const;

/**
 * Local storage key constants
 * 
 * Standardized keys for local storage to prevent naming conflicts
 * and ensure consistent data persistence across the application.
 * 
 * @example
 * ```tsx
 * import { STORAGE_KEYS } from '@/lib/constants';
 * 
 * // Save user preferences
 * localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
 * 
 * // Load theme preference
 * const theme = localStorage.getItem(STORAGE_KEYS.THEME) || THEME.DEFAULT;
 * ```
 */
export const STORAGE_KEYS = {
  /** Theme preference storage key */
  THEME: "theme",
  /** Sidebar state storage key */
  SIDEBAR_STATE: "sidebar-state",
  /** User preferences storage key */
  USER_PREFERENCES: "user-preferences",
} as const; 