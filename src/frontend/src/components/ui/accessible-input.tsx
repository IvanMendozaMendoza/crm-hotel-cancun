"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { 
  AccessibilityProps, 
  generateAriaId,
  srOnly,
  ariaBuilder,
  screenReader
} from "@/lib/accessibility";

export interface AccessibleInputProps 
  extends Omit<React.ComponentProps<typeof Input>, keyof AccessibilityProps>,
    AccessibilityProps {
  /**
   * Label for the input field
   */
  label?: string;
  /**
   * Description or help text for the input
   */
  description?: string;
  /**
   * Error message for validation
   */
  error?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is invalid
   */
  invalid?: boolean;
  /**
   * Whether the field is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show the label visually
   */
  showLabel?: boolean;
  /**
   * Whether to show the label only to screen readers
   */
  srOnlyLabel?: boolean;
  /**
   * Character count for text inputs
   */
  characterCount?: {
    current: number;
    max: number;
  };
  /**
   * Whether to announce character count changes
   */
  announceCharacterCount?: boolean;
  /**
   * Custom validation message
   */
  validationMessage?: string;
  /**
   * Whether the input has autocomplete
   */
  hasAutocomplete?: boolean;
  /**
   * Autocomplete suggestions
   */
  autocompleteSuggestions?: string[];

}

export const AccessibleInput = forwardRef<
  HTMLInputElement,
  AccessibleInputProps
>(({
  className,
  label,
  description,
  error,
  required = false,
  invalid = false,
  readOnly = false,
  disabled = false,
  showLabel = true,
  srOnlyLabel = false,
  characterCount,
  announceCharacterCount = false,
  validationMessage,
  hasAutocomplete = false,
  autocompleteSuggestions = [],

  id,
  name,
  type = "text",
  placeholder,
  onFocus,
  onBlur,
  onChange,
  ...props
}, ref) => {
  // Generate unique IDs for ARIA relationships
  const inputId = React.useMemo(() => id || generateAriaId('input'), [id]);
  const labelId = label ? generateAriaId('input', 'label') : undefined;
  const descriptionId = description ? generateAriaId('input', 'description') : undefined;
  const errorId = error ? generateAriaId('input', 'error') : undefined;
  const characterCountId = characterCount ? generateAriaId('input', 'count') : undefined;
  const suggestionsId = hasAutocomplete ? generateAriaId('input', 'suggestions') : undefined;

  // Determine if field is invalid
  const isInvalid = invalid || !!error;

  // Build ARIA attributes using utility
  const ariaAttributes: AccessibilityProps = ariaBuilder.input(inputId, {
    label: labelId,
    description: descriptionId,
    error: errorId,
    characterCount: characterCountId,
    hasAutocomplete,
    suggestionsId,
    required,
    readOnly,
    disabled,
    placeholder,
    autocompleteSuggestions,
  });

  // Enhanced change handler with character count announcements
  const enhancedChangeHandler = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    
    // Announce character count changes to screen readers if enabled
    if (announceCharacterCount && characterCount && !event.defaultPrevented) {
      const currentCount = event.target.value.length;
      screenReader.announceCharacterCount(currentCount, characterCount.max);
    }
  }, [onChange, announceCharacterCount, characterCount]);

  // Enhanced focus handler
  const enhancedFocusHandler = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(event);
    }
    
    // Announce field focus to screen readers
    if (label && !event.defaultPrevented) {
      screenReader.announceFieldFocus(label);
    }
  }, [onFocus, label]);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (showLabel || srOnlyLabel) && (
        <label
          id={labelId}
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            srOnlyLabel && srOnly,
            required && "after:content-['*'] after:ml-0.5 after:text-destructive"
          )}
        >
          {label}
          {required && (
            <span className="sr-only">Required field</span>
          )}
        </label>
      )}

      {/* Input */}
      <Input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        className={cn(
          className,
          isInvalid && "border-destructive focus-visible:ring-destructive",
          hasAutocomplete && "pr-8"
        )}
        onChange={enhancedChangeHandler}
        onFocus={enhancedFocusHandler}
        onBlur={onBlur}
        {...ariaAttributes}
        {...props}
      />

      {/* Description */}
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {/* Character Count */}
      {characterCount && (
        <p
          id={characterCountId}
          className="text-xs text-muted-foreground text-right"
          aria-live="polite"
        >
          {characterCount.current} of {characterCount.max} characters
        </p>
      )}

      {/* Autocomplete Suggestions */}
      {hasAutocomplete && autocompleteSuggestions.length > 0 && (
        <ul
          id={suggestionsId}
          role="listbox"
          aria-label={`Suggestions for ${label || 'input field'}`}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {autocompleteSuggestions.map((suggestion, index) => (
            <li
              key={index}
              role="option"
              aria-selected={false}
              className="px-3 py-2 hover:bg-accent cursor-pointer"
              tabIndex={0}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Validation Message */}
      {validationMessage && !error && (
        <p className="text-sm text-muted-foreground">
          {validationMessage}
        </p>
      )}
    </div>
  );
});

AccessibleInput.displayName = "AccessibleInput"; 