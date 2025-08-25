export interface NavigationItem {
  title: string;
  url?: string;
  icon?: string;
  items?: NavigationSubItem[];
}

export interface NavigationSubItem {
  title: string;
  url: string;
}

export interface NavigationIconMap {
  dashboard: null;
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
}

export interface NavigationState {
  expandedItems: string[];
  activeItem: string | null;
  activeSubItem: string | null;
}

export interface NavigationActions {
  toggleExpanded: (title: string) => void;
  setActiveItem: (url: string) => void;
  setActiveSubItem: (url: string) => void;
  handleNavigationClick: () => void;
}
