/**
 * Accessibility utilities for consistent ARIA implementation
 */

export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions text' | 'text' | 'additions' | 'additions removals' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text additions' | 'text removals';
  'aria-busy'?: boolean;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-required'?: boolean;
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  'aria-multiline'?: boolean;
  'aria-placeholder'?: string;
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-level'?: number;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
  'aria-colindex'?: number;
  'aria-colspan'?: number;
  'aria-rowindex'?: number;
  'aria-rowspan'?: number;
}

export interface KeyboardProps {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  tabIndex?: number;
}

export interface FocusProps {
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocusVisible?: (event: React.FocusEvent) => void;
}

export interface AccessibilityProps extends AriaProps, KeyboardProps, FocusProps {
  role?: string;
  id?: string;
  className?: string;
}

/**
 * Common ARIA labels for consistent usage
 */
export const ARIA_LABELS = {
  // Navigation
  NAVIGATION: 'Main navigation',
  SIDEBAR: 'Sidebar navigation',
  BREADCRUMB: 'Breadcrumb navigation',
  
  // Actions
  CLOSE: 'Close',
  OPEN: 'Open',
  EXPAND: 'Expand',
  COLLAPSE: 'Collapse',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  VIEW: 'View',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'Sort',
  
  // Status
  LOADING: 'Loading',
  SUCCESS: 'Success',
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Information',
  
  // Forms
  REQUIRED_FIELD: 'Required field',
  OPTIONAL_FIELD: 'Optional field',
  VALIDATION_ERROR: 'Validation error',
  FORM_SUBMISSION: 'Form submission',
  
  // Tables
  TABLE: 'Data table',
  SORTABLE_COLUMN: 'Sortable column',
  SELECT_ROW: 'Select row',
  SELECT_ALL_ROWS: 'Select all rows',
  
  // Modals and Dialogs
  MODAL: 'Modal dialog',
  DIALOG: 'Dialog',
  DRAWER: 'Drawer panel',
  
  // File Operations
  UPLOAD: 'Upload file',
  DOWNLOAD: 'Download file',
  FILE_SELECTION: 'File selection',
  
  // Pagination
  FIRST_PAGE: 'Go to first page',
  PREVIOUS_PAGE: 'Go to previous page',
  NEXT_PAGE: 'Go to next page',
  LAST_PAGE: 'Go to last page',
  PAGE_INFO: 'Page information',
  
  // Search and Filter
  SEARCH_INPUT: 'Search input',
  FILTER_OPTIONS: 'Filter options',
  CLEAR_FILTERS: 'Clear all filters',
  
  // Notifications
  NOTIFICATION: 'Notification',
  TOAST: 'Toast notification',
  ALERT: 'Alert message',
} as const;

/**
 * Common ARIA descriptions for consistent usage
 */
export const ARIA_DESCRIPTIONS = {
  // Navigation
  SIDEBAR_COLLAPSED: 'Sidebar is collapsed, click to expand',
  SIDEBAR_EXPANDED: 'Sidebar is expanded, click to collapse',
  
  // Actions
  BUTTON_LOADING: 'Button is in loading state',
  BUTTON_DISABLED: 'Button is disabled',
  BUTTON_ACTIVE: 'Button is active',
  
  // Status
  LOADING_PROGRESS: 'Loading in progress',
  OPERATION_COMPLETE: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed',
  
  // Forms
  FIELD_HELP: 'Additional help for this field',
  FIELD_ERROR: 'Error message for this field',
  FORM_PROGRESS: 'Form completion progress',
  
  // Tables
  ROW_ACTIONS: 'Actions available for this row',
  COLUMN_SORT: 'Click to sort this column',
  ROW_SELECTION: 'Click to select this row',
  
  // Modals
  MODAL_OVERLAY: 'Modal overlay, click outside to close',
  DRAWER_OVERLAY: 'Drawer overlay, click outside to close',
  
  // File Operations
  DRAG_DROP: 'Drag and drop files here',
  FILE_SIZE_LIMIT: 'File size limit information',
  SUPPORTED_FORMATS: 'Supported file formats',
} as const;

/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * Common keyboard event handlers
 */
export const createKeyboardHandlers = {
  /**
   * Handle Enter and Space key presses for clickable elements
   */
  clickable: (onClick: () => void) => ({
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE) {
        event.preventDefault();
        onClick();
      }
    },
  }),

  /**
   * Handle arrow key navigation for lists and grids
   */
  navigation: (onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void) => ({
    onKeyDown: (event: React.KeyboardEvent) => {
      switch (event.key) {
        case KEYBOARD_KEYS.ARROW_UP:
          event.preventDefault();
          onNavigate('up');
          break;
        case KEYBOARD_KEYS.ARROW_DOWN:
          event.preventDefault();
          onNavigate('down');
          break;
        case KEYBOARD_KEYS.ARROW_LEFT:
          event.preventDefault();
          onNavigate('left');
          break;
        case KEYBOARD_KEYS.ARROW_RIGHT:
          event.preventDefault();
          onNavigate('right');
          break;
      }
    },
  }),

  /**
   * Handle escape key for closing modals/drawers
   */
  dismissible: (onDismiss: () => void) => ({
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        event.preventDefault();
        onDismiss();
      }
    },
  }),

  /**
   * Handle tab key for focus management
   */
  focusTrap: (onTab: (direction: 'forward' | 'backward') => void) => ({
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.TAB) {
        const direction = event.shiftKey ? 'backward' : 'forward';
        onTab(direction);
      }
    },
  }),
};

/**
 * Screen reader announcement utilities
 */
export const screenReader = {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string, type: 'polite' | 'assertive' = 'polite', duration: number = 1000) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', type);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, duration);
  },

  /**
   * Announce focus changes
   */
  announceFocus: (elementText: string) => {
    screenReader.announce(`Focused on ${elementText.trim()}`);
  },

  /**
   * Announce loading states
   */
  announceLoading: (text: string) => {
    screenReader.announce(text);
  },

  /**
   * Announce state changes
   */
  announceState: (text: string) => {
    screenReader.announce(text);
  },

  /**
   * Announce character count
   */
  announceCharacterCount: (current: number, max: number) => {
    screenReader.announce(`${current} of ${max} characters`);
  },

  /**
   * Announce field focus
   */
  announceFieldFocus: (label: string) => {
    screenReader.announce(`Focused on ${label} field`);
  },
};

/**
 * ARIA attribute building utilities
 */
export const ariaBuilder = {
  /**
   * Build basic ARIA attributes
   */
  basic: (id: string, label?: string, description?: string) => ({
    id,
    ...(label && { 'aria-label': label }),
    ...(description && { 'aria-describedby': description }),
  }),

  /**
   * Build button ARIA attributes
   */
  button: (id: string, options: {
    label?: string;
    description?: string;
    isLoading?: boolean;
    isActive?: boolean;
    isExpanded?: boolean;
    hasPopup?: boolean;
    isGrouped?: boolean;
    groupPosition?: number;
    groupSize?: number;
    disabled?: boolean;
    announceChanges?: boolean;
  }): AccessibilityProps => {
    const { label, description, isLoading, isActive, isExpanded, hasPopup, isGrouped, groupPosition, groupSize, disabled, announceChanges } = options;
    
    return {
      id,
      'aria-label': label,
      ...(description && { 'aria-describedby': description }),
      ...(isLoading && {
        'aria-busy': true,
        'aria-live': announceChanges ? 'polite' : 'off',
      }),
      ...(isActive !== undefined && { 'aria-pressed': isActive }),
      ...(isExpanded !== undefined && { 'aria-expanded': isExpanded }),
      ...(hasPopup && { 'aria-haspopup': true }),
      ...(isGrouped && groupPosition && groupSize && {
        'aria-posinset': groupPosition,
        'aria-setsize': groupSize,
      }),
      ...(disabled && { 'aria-disabled': true }),
    };
  },

  /**
   * Build input ARIA attributes
   */
  input: (id: string, options: {
    label?: string;
    description?: string;
    error?: string;
    characterCount?: string;
    hasAutocomplete?: boolean;
    suggestionsId?: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    autocompleteSuggestions?: string[];
  }): AccessibilityProps => {
    const { label, description, error, characterCount, hasAutocomplete, suggestionsId, required, readOnly, disabled, placeholder, autocompleteSuggestions } = options;
    
    return {
      id,
      'aria-labelledby': label,
      ...(description && { 'aria-describedby': description }),
      ...(error && { 'aria-describedby': `${description || ''} ${error}`.trim() }),
      ...(characterCount && { 'aria-describedby': `${description || ''} ${characterCount}`.trim() }),
      ...(hasAutocomplete && {
        'aria-autocomplete': 'list' as const,
        'aria-controls': suggestionsId,
        'aria-expanded': (autocompleteSuggestions?.length ?? 0) > 0,
      }),
      ...(required && { 'aria-required': true }),
      ...(readOnly && { 'aria-readonly': true }),
      ...(disabled && { 'aria-disabled': true }),
      ...(placeholder && { 'aria-placeholder': placeholder }),
    };
  },

  /**
   * Build table ARIA attributes
   */
  table: (id: string, options: {
    caption?: string;
    description?: string;
    sortable?: boolean;
    selectable?: boolean;
  }): AccessibilityProps => {
    const { caption, description, sortable, selectable } = options;
    
    return {
      id,
      role: 'table',
      'aria-label': ARIA_LABELS.TABLE,
      ...(caption && { 'aria-labelledby': caption }),
      ...(description && { 'aria-describedby': description }),
      ...(sortable && { 'aria-sort': 'none' as const }),
      ...(selectable && { 'aria-multiselectable': true }),
    };
  },

  /**
   * Build table row ARIA attributes
   */
  tableRow: (id: string, options: {
    rowIndex: number;
    totalRows: number;
    description?: string;
    selected?: boolean;
    expanded?: boolean;
    hasActions?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
  }) => {
    const { rowIndex, totalRows, description, selected, expanded, hasActions, isLoading, disabled } = options;
    
    return {
      id,
      role: 'row',
      'aria-rowindex': rowIndex,
      'aria-setsize': totalRows,
      ...(description && { 'aria-describedby': description }),
      ...(selected !== undefined && { 'aria-selected': selected }),
      ...(expanded !== undefined && { 'aria-expanded': expanded }),
      ...(hasActions && { 'aria-haspopup': true }),
      ...(isLoading && { 'aria-busy': true }),
      ...(disabled && { 'aria-disabled': true }),
    };
  },

  /**
   * Build table cell ARIA attributes
   */
  tableCell: (id: string, options: {
    colIndex: number;
    description?: string;
    isHeader?: boolean;
    sortable?: boolean;
    selectable?: boolean;
    expandable?: boolean;
  }): AccessibilityProps => {
    const { colIndex, description, isHeader, sortable, selectable, expandable } = options;
    
    return {
      id,
      role: isHeader ? 'columnheader' : 'cell',
      'aria-colindex': colIndex,
      'aria-colspan': 1,
      ...(description && { 'aria-describedby': description }),
      ...(sortable && { 'aria-sort': 'none' as const }),
      ...(selectable && { 'aria-selected': false }),
      ...(expandable && { 'aria-expanded': false }),
    };
  },
};

/**
 * Generate unique IDs for ARIA relationships
 */
export const generateAriaId = (prefix: string, suffix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}${suffix ? `-${suffix}` : ''}`;
};

/**
 * Create ARIA live region for announcements
 */
export const createLiveRegion = (type: 'polite' | 'assertive' = 'polite') => {
  const id = generateAriaId('live-region');
  return {
    id,
    'aria-live': type,
    'aria-atomic': true,
    'aria-relevant': 'additions text',
    className: 'sr-only',
  };
};

/**
 * Screen reader only class utility
 */
export const srOnly = 'sr-only';

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Focus the first focusable element in a container
   */
  focusFirst: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  },

  /**
   * Focus the last focusable element in a container
   */
  focusLast: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement.focus();
    }
  },

  /**
   * Check if an element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    const tagName = element.tagName.toLowerCase();
    const tabIndex = element.getAttribute('tabindex');
    
    if ((element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled || element.hidden) return false;
    
    if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
      return true;
    }
    
    if (tagName === 'a' && element.hasAttribute('href')) {
      return true;
    }
    
    if (tabIndex !== null && tabIndex !== '-1') {
      return true;
    }
    
    return false;
  },
};

/**
 * Semantic HTML utilities
 */
export const semanticHTML = {
  /**
   * Create a heading structure
   */
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6, id?: string) => ({
    [`h${level}`]: true,
    id,
    ...(id && { 'aria-labelledby': id }),
  }),

  /**
   * Create a landmark region
   */
  landmark: (role: 'banner' | 'main' | 'complementary' | 'contentinfo' | 'form' | 'navigation' | 'search') => ({
    role,
    'aria-label': ARIA_LABELS[role.toUpperCase() as keyof typeof ARIA_LABELS] || role,
  }),

  /**
   * Create a list structure
   */
  list: (type: 'list' | 'listbox' | 'menu' | 'menubar' | 'tablist' | 'tree' | 'treegrid') => ({
    role: type,
    'aria-label': ARIA_LABELS[type.toUpperCase() as keyof typeof ARIA_LABELS] || type,
  }),
};

/**
 * Validation and error utilities
 */
export const validation = {
  /**
   * Create ARIA attributes for form validation
   */
  createAriaAttributes: (hasError: boolean, errorMessage?: string, isRequired?: boolean) => ({
    'aria-invalid': hasError,
    'aria-required': isRequired,
    ...(errorMessage && { 'aria-describedby': generateAriaId('error', 'message') }),
  }),

  /**
   * Create error message with proper ARIA
   */
  createErrorMessage: (message: string, id?: string) => ({
    id: id || generateAriaId('error', 'message'),
    role: 'alert',
    'aria-live': 'polite',
    className: 'text-destructive text-sm',
    children: message,
  }),
};

// Types are already exported above 