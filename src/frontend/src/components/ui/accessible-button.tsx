"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { 
  AccessibilityProps, 
  createKeyboardHandlers,
  generateAriaId 
} from "@/lib/accessibility";

export interface AccessibleButtonProps 
  extends Omit<React.ComponentProps<typeof Button>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Descriptive label for screen readers
   */
  ariaLabel?: string;
  /**
   * Description of the button's purpose
   */
  ariaDescription?: string;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * Whether the button is in an active/pressed state
   */
  isActive?: boolean;
  /**
   * Whether the button expands/collapses content
   */
  isExpanded?: boolean;
  /**
   * Whether the button has a popup (dropdown, menu, etc.)
   */
  hasPopup?: boolean;
  /**
   * Whether the button is part of a group
   */
  isGrouped?: boolean;
  /**
   * Position in a group (1-based index)
   */
  groupPosition?: number;
  /**
   * Total size of the group
   */
  groupSize?: number;
  /**
   * Whether the button should announce changes to screen readers
   */
  announceChanges?: boolean;
  /**
   * Custom loading text for screen readers
   */
  loadingText?: string;
  /**
   * Custom active text for screen readers
   */
  activeText?: string;
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({
  children,
  className,
  ariaLabel,
  ariaDescription,
  isLoading = false,
  isActive = false,
  isExpanded,
  hasPopup = false,
  isGrouped = false,
  groupPosition,
  groupSize,
  announceChanges = false,
  loadingText = "Loading",
  activeText = "Active",
  disabled,
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const buttonId = React.useMemo(() => generateAriaId('button'), []);
  const descriptionId = ariaDescription ? generateAriaId('button', 'description') : undefined;
  const loadingId = isLoading ? generateAriaId('button', 'loading') : undefined;
  const activeId = isActive ? generateAriaId('button', 'active') : undefined;

  // Build ARIA attributes
  const ariaAttributes: AccessibilityProps = {
    id: buttonId,
    'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
    ...(ariaDescription && {
      'aria-describedby': descriptionId,
    }),
    ...(isLoading && {
      'aria-busy': true,
      'aria-live': announceChanges ? 'polite' : 'off',
    }),
    ...(isActive !== undefined && {
      'aria-pressed': isActive,
    }),
    ...(isExpanded !== undefined && {
      'aria-expanded': isExpanded,
    }),
    ...(hasPopup && {
      'aria-haspopup': true,
    }),
    ...(isGrouped && groupPosition && groupSize && {
      'aria-posinset': groupPosition,
      'aria-setsize': groupSize,
    }),
    ...(disabled && {
      'aria-disabled': true,
    }),
  };

  // Enhanced keyboard handlers
  const enhancedKeyboardHandlers = React.useMemo(() => {
    const handlers = { ...createKeyboardHandlers.clickable(() => {
      // Handle click programmatically
      if (onClick) {
        const syntheticEvent = {} as React.MouseEvent<HTMLButtonElement>;
        onClick(syntheticEvent);
      }
    }) };
    
    if (onKeyDown) {
      const originalOnKeyDown = handlers.onKeyDown;
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        originalOnKeyDown?.(event);
        onKeyDown(event as React.KeyboardEvent<HTMLButtonElement>);
      };
    }
    
    return handlers;
  }, [onClick, onKeyDown]);

  // Enhanced click handler with accessibility announcements
  const enhancedClickHandler = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
    
    // Announce state changes to screen readers if enabled
    if (announceChanges && !event.defaultPrevented) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      
      if (isLoading) {
        announcement.textContent = loadingText;
      } else if (isActive !== undefined) {
        announcement.textContent = isActive ? activeText : 'Inactive';
      }
      
      if (announcement.textContent) {
        document.body.appendChild(announcement);
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }
    }
  }, [onClick, announceChanges, isLoading, isActive, loadingText, activeText]);

  return (
    <>
      {/* Hidden description for screen readers */}
      {ariaDescription && (
        <span id={descriptionId} className="sr-only">
          {ariaDescription}
        </span>
      )}
      
      {/* Hidden loading state announcement */}
      {isLoading && (
        <span id={loadingId} className="sr-only" aria-live="polite">
          {loadingText}
        </span>
      )}
      
      {/* Hidden active state announcement */}
      {isActive && (
        <span id={activeId} className="sr-only" aria-live="polite">
          {activeText}
        </span>
      )}
      
      <Button
        ref={ref}
        className={cn(
          className,
          isLoading && "cursor-not-allowed",
          isActive && "ring-2 ring-primary ring-offset-2"
        )}
        disabled={disabled || isLoading}
        onClick={enhancedClickHandler}
        {...ariaAttributes}
        {...enhancedKeyboardHandlers}
        {...props}
      >
        {children}
        
        {/* Loading indicator with screen reader text */}
        {isLoading && (
          <>
            <span className="sr-only">{loadingText}</span>
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </>
        )}
      </Button>
    </>
  );
});

AccessibleButton.displayName = "AccessibleButton"; 