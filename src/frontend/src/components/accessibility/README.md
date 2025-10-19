# Accessibility System

This directory contains a comprehensive accessibility system designed to provide consistent ARIA implementation, keyboard navigation, and screen reader support across the application.

## 🎯 **Overview**

The accessibility system provides:
- **ARIA Labels & Descriptions**: Consistent screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Advanced focus tracking and trapping
- **Screen Reader Support**: Live announcements and status updates
- **Semantic HTML**: Proper HTML structure and roles

## 🧩 **Core Components**

### 1. AccessibleButton
Enhanced button component with comprehensive accessibility features.

```tsx
import { AccessibleButton } from "@/components/ui/accessible";

<AccessibleButton
  ariaLabel="Submit form"
  ariaDescription="Click to submit your information"
  isLoading={isSubmitting}
  loadingText="Processing..."
  announceChanges={true}
  isActive={isActive}
  activeText="Currently active"
>
  Submit
</AccessibleButton>
```

**Key Features:**
- ARIA labels and descriptions
- Loading states with screen reader announcements
- Active/pressed states
- Expandable content support
- Button grouping support
- Focus management

### 2. AccessibleInput
Enhanced input component with labels, validation, and accessibility.

```tsx
import { AccessibleInput } from "@/components/ui/accessible";

<AccessibleInput
  label="Full Name"
  description="Enter your full name as it appears on official documents"
  required={true}
  error={formErrors.name}
  characterCount={{
    current: value.length,
    max: 50
  }}
  announceCharacterCount={true}
  hasAutocomplete={true}
  autocompleteSuggestions={['John Doe', 'Jane Smith']}
/>
```

**Key Features:**
- Automatic label association
- Error message handling
- Character count with announcements
- Autocomplete support
- Required field indicators
- Focus announcements

### 3. AccessibleTable
Enhanced table component with sorting, selection, and navigation.

```tsx
import { AccessibleTable } from "@/components/ui/accessible";

<AccessibleTable
  caption="User Management Table"
  description="Table showing user accounts with their roles and status"
  sortable={true}
  selectable={true}
  hasActions={true}
  totalRows={data.length}
  announceSelection={true}
  announceSorting={true}
>
  {/* Table content */}
</AccessibleTable>
```

**Key Features:**
- Table captions and descriptions
- Sortable columns with ARIA
- Row selection with announcements
- Keyboard navigation (arrow keys)
- Focus management
- Status announcements

## 🎹 **Keyboard Navigation**

### Supported Keys
- **Tab**: Navigate between focusable elements
- **Arrow Keys**: Navigate within lists, tables, and grids
- **Enter/Space**: Activate buttons and interactive elements
- **Escape**: Close modals, drawers, and dismiss content
- **Home/End**: Navigate to first/last element
- **Page Up/Down**: Navigate in large lists

### Navigation Patterns
```tsx
// Arrow key navigation for lists
const handlers = createKeyboardHandlers.navigation((direction) => {
  switch (direction) {
    case 'up': navigatePrevious();
    case 'down': navigateNext();
    case 'left': navigateLeft();
    case 'right': navigateRight();
  }
});

// Clickable elements with keyboard support
const clickableHandlers = createKeyboardHandlers.clickable(() => {
  handleClick();
});
```

## 🎯 **Focus Management**

### useFocusManagement Hook
Advanced focus management with comprehensive options.

```tsx
import { useFocusManagement } from "@/hooks/use-focus-management";

const [focusState, focusActions] = useFocusManagement(containerRef, {
  trapFocus: true,           // Keep focus within container
  arrowNavigation: true,      // Enable arrow key navigation
  tabNavigation: true,        // Handle tab key
  escapeKey: true,            // Handle escape key
  announceFocus: true,        // Announce focus changes
  autoFocus: true,            // Auto-focus first element
  restoreFocus: true,         // Restore focus on unmount
});

// Focus actions
focusActions.focusFirst();     // Focus first element
focusActions.focusNext();      // Focus next element
focusActions.focusByIndex(2); // Focus by index
focusActions.resetFocus();     // Reset to first element
```

### Focus State
```tsx
interface FocusState {
  focusedElement: HTMLElement | null;
  hasFocus: boolean;
  focusedIndex: number;
  totalFocusable: number;
}
```

## 🏷️ **ARIA Implementation**

### Common ARIA Labels
```tsx
import { ARIA_LABELS } from "@/lib/accessibility";

// Navigation
ARIA_LABELS.NAVIGATION        // "Main navigation"
ARIA_LABELS.SIDEBAR          // "Sidebar navigation"
ARIA_LABELS.BREADCRUMB       // "Breadcrumb navigation"

// Actions
ARIA_LABELS.CLOSE            // "Close"
ARIA_LABELS.OPEN             // "Open"
ARIA_LABELS.SUBMIT           // "Submit"
ARIA_LABELS.CANCEL           // "Cancel"

// Status
ARIA_LABELS.LOADING          // "Loading"
ARIA_LABELS.SUCCESS          // "Success"
ARIA_LABELS.ERROR            // "Error"
```

### Common ARIA Descriptions
```tsx
import { ARIA_DESCRIPTIONS } from "@/lib/accessibility";

// Navigation
ARIA_DESCRIPTIONS.SIDEBAR_COLLAPSED  // "Sidebar is collapsed, click to expand"
ARIA_DESCRIPTIONS.SIDEBAR_EXPANDED   // "Sidebar is expanded, click to collapse"

// Actions
ARIA_DESCRIPTIONS.BUTTON_LOADING     // "Button is in loading state"
ARIA_DESCRIPTIONS.BUTTON_DISABLED    // "Button is disabled"

// Forms
ARIA_DESCRIPTIONS.FIELD_HELP         // "Additional help for this field"
ARIA_DESCRIPTIONS.FIELD_ERROR        // "Error message for this field"
```

## 🔧 **Utilities**

### ID Generation
```tsx
import { generateAriaId } from "@/lib/accessibility";

const buttonId = generateAriaId('button');           // "button-1234567890-abc123def"
const descriptionId = generateAriaId('button', 'description'); // "button-1234567890-abc123def-description"
```

### Live Regions
```tsx
import { createLiveRegion } from "@/lib/accessibility";

const liveRegion = createLiveRegion('polite'); // or 'assertive'
// Returns: { id, 'aria-live': 'polite', 'aria-atomic': true, ... }
```

### Focus Management
```tsx
import { focusManagement } from "@/lib/accessibility";

focusManagement.focusFirst(container);    // Focus first focusable element
focusManagement.focusLast(container);     // Focus last focusable element
focusManagement.isFocusable(element);     // Check if element is focusable
```

## 📱 **Screen Reader Support**

### Live Announcements
```tsx
// Automatic announcements for state changes
<AccessibleButton
  announceChanges={true}
  loadingText="Processing request"
  activeText="Currently active"
>
  Submit
</AccessibleButton>

// Manual announcements
const announcement = document.createElement('div');
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
announcement.className = 'sr-only';
announcement.textContent = 'Operation completed successfully';
```

### Status Updates
```tsx
// Table status announcements
<AccessibleTable
  announceSelection={true}
  announceSorting={true}
  announcePagination={true}
>
  {/* Table content */}
</AccessibleTable>

// Form validation announcements
<AccessibleInput
  error="This field is required"
  // Automatically announces error to screen readers
/>
```

## 🎨 **Styling & CSS**

### Screen Reader Only Class
```tsx
import { srOnly } from "@/lib/accessibility";

<span className={srOnly}>
  This text is only visible to screen readers
</span>
```

### Focus Indicators
```tsx
// Built-in focus styles
.focus-visible:ring-2
.focus-visible:ring-primary
.focus-visible:ring-offset-2

// Custom focus styles
.focus:outline-none
.focus:ring-2
.focus:ring-blue-500
.focus:ring-offset-2
```

## 🧪 **Testing & Validation**

### Manual Testing
1. **Keyboard Navigation**: Use Tab, Arrow keys, Enter, Space, Escape
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Focus Indicators**: Ensure visible focus indicators
4. **ARIA Attributes**: Validate with browser dev tools

### Automated Testing
```tsx
// Test focus management
const [focusState, focusActions] = useFocusManagement(containerRef);
expect(focusState.totalFocusable).toBe(5);
expect(focusState.focusedIndex).toBe(0);

// Test ARIA attributes
expect(button).toHaveAttribute('aria-label', 'Submit form');
expect(button).toHaveAttribute('aria-describedby');
```

## 📚 **Best Practices**

### 1. Always Provide Labels
```tsx
// Good
<AccessibleInput label="Email Address" />

// Bad
<input placeholder="Enter email" />
```

### 2. Use Descriptive ARIA Labels
```tsx
// Good
<AccessibleButton ariaLabel="Delete user account" />

// Bad
<AccessibleButton ariaLabel="Delete" />
```

### 3. Announce Important Changes
```tsx
// Good
<AccessibleButton
  announceChanges={true}
  loadingText="Saving changes"
>
  Save
</AccessibleButton>

// Bad
<AccessibleButton>Save</AccessibleButton>
```

### 4. Handle Focus Properly
```tsx
// Good
const [focusState, focusActions] = useFocusManagement(containerRef, {
  restoreFocus: true,
  trapFocus: true,
});

// Bad
// No focus management
```

### 5. Provide Context
```tsx
// Good
<AccessibleTable
  caption="User Management"
  description="Table showing all users with their roles and status"
>

// Bad
<table>
  {/* No context */}
</table>
```

## 🚀 **Getting Started**

### 1. Install Dependencies
```bash
# Already included in the project
```

### 2. Import Components
```tsx
import { 
  AccessibleButton, 
  AccessibleInput, 
  AccessibleTable 
} from "@/components/ui/accessible";
```

### 3. Use Accessibility Hooks
```tsx
import { useFocusManagement } from "@/hooks/use-focus-management";
import { ARIA_LABELS } from "@/lib/accessibility";
```

### 4. Test with Screen Readers
- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca (free)

## 🔍 **Troubleshooting**

### Common Issues
1. **Focus not visible**: Check CSS focus styles
2. **Screen reader not announcing**: Verify aria-live attributes
3. **Keyboard navigation broken**: Check event handlers
4. **ARIA validation errors**: Use browser dev tools

### Debug Tools
- **Chrome DevTools**: Accessibility tab
- **Firefox DevTools**: Accessibility inspector
- **axe-core**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool

This accessibility system provides a solid foundation for creating inclusive, accessible applications that work for all users, regardless of their abilities or assistive technology needs. 