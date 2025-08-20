"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KEYBOARD_KEYS, focusManagement, screenReader } from "@/lib/accessibility";

export interface FocusManagementOptions {
  /**
   * Whether to trap focus within the container
   */
  trapFocus?: boolean;
  /**
   * Whether to restore focus when unmounting
   */
  restoreFocus?: boolean;
  /**
   * Whether to auto-focus the first element on mount
   */
  autoFocus?: boolean;
  /**
   * Whether to handle arrow key navigation
   */
  arrowNavigation?: boolean;
  /**
   * Whether to handle tab key navigation
   */
  tabNavigation?: boolean;
  /**
   * Whether to handle escape key
   */
  escapeKey?: boolean;
  /**
   * Custom selector for focusable elements
   */
  focusableSelector?: string;
  /**
   * Whether to announce focus changes to screen readers
   */
  announceFocus?: boolean;
}

export interface FocusState {
  /**
   * Currently focused element
   */
  focusedElement: HTMLElement | null;
  /**
   * Whether the container has focus
   */
  hasFocus: boolean;
  /**
   * Index of the currently focused element
   */
  focusedIndex: number;
  /**
   * Total number of focusable elements
   */
  totalFocusable: number;
}

export interface FocusActions {
  /**
   * Focus the first element
   */
  focusFirst: () => void;
  /**
   * Focus the last element
   */
  focusLast: () => void;
  /**
   * Focus the next element
   */
  focusNext: () => void;
  /**
   * Focus the previous element
   */
  focusPrevious: () => void;
  /**
   * Focus element by index
   */
  focusByIndex: (index: number) => void;
  /**
   * Focus element by selector
   */
  focusBySelector: (selector: string) => void;
  /**
   * Focus element by ID
   */
  focusById: (id: string) => void;
  /**
   * Check if element is focusable
   */
  isFocusable: (element: HTMLElement) => boolean;
  /**
   * Get all focusable elements
   */
  getFocusableElements: () => HTMLElement[];
  /**
   * Reset focus to the first element
   */
  resetFocus: () => void;
}

export const useFocusManagement = (
  containerRef: React.RefObject<HTMLElement>,
  options: FocusManagementOptions = {}
): [FocusState, FocusActions] => {
  const {
    trapFocus = false,
    restoreFocus = false,
    autoFocus = false,
    arrowNavigation = false,
    tabNavigation = false,
    escapeKey = false,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    announceFocus = false,
  } = options;

  const [focusState, setFocusState] = useState<FocusState>({
    focusedElement: null,
    hasFocus: false,
    focusedIndex: -1,
    totalFocusable: 0,
  });

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Get focusable elements from the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelector)
    ) as HTMLElement[];
    
    return elements.filter(element => focusManagement.isFocusable(element));
  }, [containerRef, focusableSelector]);

  // Update focus state
  const updateFocusState = useCallback((element: HTMLElement | null) => {
    if (!element) {
      setFocusState({
        focusedElement: null,
        hasFocus: false,
        focusedIndex: -1,
        totalFocusable: focusableElementsRef.current.length,
      });
      return;
    }

    const focusableElements = getFocusableElements();
    const index = focusableElements.indexOf(element);
    
    setFocusState({
      focusedElement: element,
      hasFocus: true,
      focusedIndex: index,
      totalFocusable: focusableElements.length,
    });

    // Announce focus change to screen readers
    if (announceFocus && element.textContent) {
      screenReader.announceFocus(element.textContent);
    }
  }, [getFocusableElements, announceFocus]);

  // Focus actions
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const focusNext = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const currentIndex = focusState.focusedIndex;
    const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
    elements[nextIndex].focus();
  }, [getFocusableElements, focusState.focusedIndex]);

  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const currentIndex = focusState.focusedIndex;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
    elements[prevIndex].focus();
  }, [getFocusableElements, focusState.focusedIndex]);

  const focusByIndex = useCallback((index: number) => {
    const elements = getFocusableElements();
    if (index >= 0 && index < elements.length) {
      elements[index].focus();
    }
  }, [getFocusableElements]);

  const focusBySelector = useCallback((selector: string) => {
    if (!containerRef.current) return;
    
    const element = containerRef.current.querySelector(selector) as HTMLElement;
    if (element && focusManagement.isFocusable(element)) {
      element.focus();
    }
  }, [containerRef]);

  const focusById = useCallback((id: string) => {
    const element = document.getElementById(id) as HTMLElement;
    if (element && focusManagement.isFocusable(element)) {
      element.focus();
    }
  }, []);

  const isFocusable = useCallback((element: HTMLElement): boolean => {
    return focusManagement.isFocusable(element);
  }, []);

  const resetFocus = useCallback(() => {
    focusFirst();
  }, [focusFirst]);

  // Handle focus events
  const handleFocus = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (containerRef.current?.contains(target)) {
      updateFocusState(target);
    }
  }, [containerRef, updateFocusState]);

  const handleBlur = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (containerRef.current?.contains(target)) {
      // Check if focus is moving to another element within the container
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (!containerRef.current?.contains(relatedTarget)) {
        updateFocusState(null);
      }
    }
  }, [containerRef, updateFocusState]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    const target = event.target as HTMLElement;
    if (!containerRef.current.contains(target)) return;

    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (arrowNavigation) {
          event.preventDefault();
          focusNext();
        }
        break;

      case KEYBOARD_KEYS.ARROW_UP:
        if (arrowNavigation) {
          event.preventDefault();
          focusPrevious();
        }
        break;

      case KEYBOARD_KEYS.ARROW_LEFT:
        if (arrowNavigation) {
          event.preventDefault();
          focusPrevious();
        }
        break;

      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (arrowNavigation) {
          event.preventDefault();
          focusNext();
        }
        break;

      case KEYBOARD_KEYS.HOME:
        if (arrowNavigation) {
          event.preventDefault();
          focusFirst();
        }
        break;

      case KEYBOARD_KEYS.END:
        if (arrowNavigation) {
          event.preventDefault();
          focusLast();
        }
        break;

      case KEYBOARD_KEYS.TAB:
        if (tabNavigation && trapFocus) {
          const elements = getFocusableElements();
          if (elements.length === 0) return;

          const currentIndex = focusState.focusedIndex;
          
          if (event.shiftKey) {
            // Tab backwards
            if (currentIndex <= 0) {
              event.preventDefault();
              elements[elements.length - 1].focus();
            }
          } else {
            // Tab forwards
            if (currentIndex >= elements.length - 1) {
              event.preventDefault();
              elements[0].focus();
            }
          }
        }
        break;

      case KEYBOARD_KEYS.ESCAPE:
        if (escapeKey) {
          event.preventDefault();
          // Focus the container or trigger escape action
          containerRef.current?.focus();
        }
        break;
    }
  }, [
    containerRef,
    arrowNavigation,
    tabNavigation,
    trapFocus,
    escapeKey,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    getFocusableElements,
    focusState.focusedIndex,
  ]);

  // Initialize focus management
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store previous focus for restoration
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Get initial focusable elements
    focusableElementsRef.current = getFocusableElements();

    // Auto-focus first element if enabled
    if (autoFocus && focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0].focus();
    }

    // Add event listeners
    container.addEventListener('focusin', handleFocus);
    container.addEventListener('focusout', handleBlur);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Remove event listeners
      container.removeEventListener('focusin', handleFocus);
      container.removeEventListener('focusout', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);

      // Restore previous focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [
    containerRef,
    restoreFocus,
    autoFocus,
    getFocusableElements,
    handleFocus,
    handleBlur,
    handleKeyDown,
  ]);

  // Update focusable elements when container changes
  useEffect(() => {
    focusableElementsRef.current = getFocusableElements();
    setFocusState(prev => ({
      ...prev,
      totalFocusable: focusableElementsRef.current.length,
    }));
  }, [getFocusableElements]);

  const actions: FocusActions = {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusByIndex,
    focusBySelector,
    focusById,
    isFocusable,
    getFocusableElements,
    resetFocus,
  };

  return [focusState, actions];
}; 