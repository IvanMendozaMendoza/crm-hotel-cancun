// Base navigation item interface
export interface NavigationItem {
  title: string;
  icon?: string | React.ComponentType<{ className?: string }>;
  items?: NavigationSubItem[];
  isActive?: boolean; // Optional property for cloud navigation items
}

// Navigation item with URL (for direct navigation)
export interface NavigationItemWithUrl extends NavigationItem {
  url: string;
}

// Navigation item without URL (for dropdown triggers)
export interface NavigationItemWithoutUrl extends NavigationItem {
  items: NavigationSubItem[]; // Must have items if no URL
}

// Union type for navigation items
export type NavigationItemType = NavigationItemWithUrl | NavigationItemWithoutUrl;

// Sub-item interface (always has URL)
export interface NavigationSubItem {
  title: string;
  url: string;
}

// Navigation data structure for the sidebar
export interface NavigationData {
  navMain: NavigationItemType[];
  navClouds?: NavigationItemType[];
  navSecondary?: NavigationItemType[];
  documents?: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

// Icon mapping for navigation items
export interface NavigationIconMap {
  dashboard: React.ComponentType<{ className?: string }>;
  users: React.ComponentType<{ className?: string }>;
  settings: React.ComponentType<{ className?: string }>;
  help: React.ComponentType<{ className?: string }>;
  report: React.ComponentType<{ className?: string }>;
  list: React.ComponentType<{ className?: string }>;
  search: React.ComponentType<{ className?: string }>;
  chart: React.ComponentType<{ className?: string }>;
  database: React.ComponentType<{ className?: string }>;
  fileai: React.ComponentType<{ className?: string }>;
  filedesc: React.ComponentType<{ className?: string }>;
  fileword: React.ComponentType<{ className?: string }>;
  folder: React.ComponentType<{ className?: string }>;
  camera: React.ComponentType<{ className?: string }>;
}

// Navigation state for tracking active items
export interface NavigationState {
  expandedItems: string[];
  activeItem: string | null;
  activeSubItem: string | null;
}

// Navigation actions for state management
export interface NavigationActions {
  toggleExpanded: (title: string) => void;
  setActiveItem: (url: string) => void;
  setActiveSubItem: (url: string) => void;
  handleNavigationClick: () => void;
}

// Type guards for runtime type checking
export const hasUrl = (item: NavigationItemType): item is NavigationItemWithUrl => {
  return 'url' in item && item.url !== undefined;
};

export const hasItems = (item: NavigationItemType): item is NavigationItemWithoutUrl => {
  return 'items' in item && item.items !== undefined && item.items.length > 0;
};

export const isParentItem = (item: NavigationItemType): boolean => {
  return hasItems(item) && !hasUrl(item);
};

export const isDirectNavigationItem = (item: NavigationItemType): boolean => {
  return hasUrl(item) && (!hasItems(item) || item.items?.length === 0);
};
