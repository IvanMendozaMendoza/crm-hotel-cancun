"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AccessibleButton } from "../ui/accessible-button";
import { AccessibleInput } from "../ui/accessible-input";
import { 
  AccessibleTable, 
  AccessibleTableHeader, 
  AccessibleTableRow, 
  AccessibleTableCell 
} from "../ui/accessible-table";
import { useFocusManagement } from "@/hooks/use-focus-management";


// Sample data for the table
const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "Active" },
];

export const AccessibilityDemo = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortDirection] = useState<'ascending' | 'descending' | 'none'>('none');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focusContainerRef = useRef<HTMLDivElement>(null);
  const [focusState, focusActions] = useFocusManagement(focusContainerRef as React.RefObject<HTMLElement>, {
    trapFocus: true,
    arrowNavigation: true,
    tabNavigation: true,
    escapeKey: true,
    announceFocus: true,
  });

  // Handle row selection
  const handleRowSelection = (rowId: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
    setFormErrors({});
  };



  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Accessibility Features Demo</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive showcase of accessibility features and components
        </p>
      </div>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="focus">Focus Management</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessible Buttons</CardTitle>
              <CardDescription>
                Buttons with comprehensive ARIA labels, keyboard navigation, and screen reader support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Basic Buttons</h4>
                <div className="flex flex-wrap gap-4">
                  <AccessibleButton
                    ariaLabel="Primary action button"
                    ariaDescription="This button performs the main action"
                  >
                    Primary Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    variant="secondary"
                    ariaLabel="Secondary action button"
                    ariaDescription="This button performs a secondary action"
                  >
                    Secondary Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    variant="outline"
                    ariaLabel="Outline style button"
                    ariaDescription="This button has an outline style"
                  >
                    Outline Button
                  </AccessibleButton>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Interactive Buttons</h4>
                <div className="flex flex-wrap gap-4">
                  <AccessibleButton
                    isLoading={true}
                    loadingText="Processing request"
                    announceChanges={true}
                    ariaLabel="Loading button example"
                  >
                    Loading Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    isActive={true}
                    activeText="Currently active"
                    announceChanges={true}
                    ariaLabel="Active state button"
                  >
                    Active Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    isExpanded={false}
                    ariaLabel="Expandable content button"
                    ariaDescription="Click to expand additional content"
                  >
                    Expand Content
                  </AccessibleButton>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Button Groups</h4>
                <div className="flex flex-wrap gap-4">
                  {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                    <AccessibleButton
                      key={option}
                      variant="outline"
                      isGrouped={true}
                      groupPosition={index + 1}
                      groupSize={3}
                      ariaLabel={`${option} option`}
                      ariaDescription={`${index + 1} of 3 options`}
                    >
                      {option}
                    </AccessibleButton>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessible Inputs</CardTitle>
              <CardDescription>
                Form inputs with labels, descriptions, validation, and screen reader support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <AccessibleInput
                  label="Full Name"
                  description="Enter your full name as it appears on official documents"
                  required={true}
                  error={formErrors.name}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  characterCount={{
                    current: formData.name.length,
                    max: 50
                  }}
                  announceCharacterCount={true}
                />

                <AccessibleInput
                  label="Email Address"
                  description="We'll use this to send you important updates"
                  required={true}
                  error={formErrors.email}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  type="email"
                  placeholder="Enter your email address"
                  hasAutocomplete={true}
                  autocompleteSuggestions={['john@example.com', 'jane@example.com', 'admin@company.com']}
                />

                <AccessibleInput
                  label="Message"
                  description="Tell us about your inquiry or feedback"
                  required={true}
                  error={formErrors.message}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message"
                  characterCount={{
                    current: formData.message.length,
                    max: 500
                  }}
                  announceCharacterCount={true}
                />

                <div className="flex gap-4">
                  <AccessibleButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Submitting form"
                    disabled={isSubmitting}
                    ariaLabel="Submit form button"
                    ariaDescription="Click to submit your information"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </AccessibleButton>
                  
                  <AccessibleButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({ name: '', email: '', message: '' });
                      setFormErrors({});
                    }}
                    ariaLabel="Clear form button"
                    ariaDescription="Click to clear all form fields"
                  >
                    Clear Form
                  </AccessibleButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessible Tables</CardTitle>
              <CardDescription>
                Data tables with sorting, selection, and comprehensive accessibility features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessibleTable
                caption="User Management Table"
                description="Table showing user accounts with their roles and status"
                sortable={true}
                selectable={true}
                totalRows={sampleData.length}
                visibleRows={sampleData.length}
                currentPage={1}
                totalPages={1}
                className="w-full"
              >
                <thead>
                  <tr>
                    <AccessibleTableHeader
                    label="Select"
                    description="Checkbox to select this row"
                    width="60px"
                  >
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(sampleData.map(row => row.id)));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                      checked={selectedRows.size === sampleData.length}
                      ref={(el) => {
                        if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < sampleData.length;
                      }}
                    />
                  </AccessibleTableHeader>
                  
                  <AccessibleTableHeader
                    label="Name"
                    sortable={true}
                    sortDirection={sortDirection}
                    isSorted={sortDirection !== 'none'}
                    description="User's full name"
                  >
                    Name
                  </AccessibleTableHeader>
                  
                  <AccessibleTableHeader
                    label="Email"
                    sortable={true}
                    description="User's email address"
                  >
                    Email
                  </AccessibleTableHeader>
                  
                  <AccessibleTableHeader
                    label="Role"
                    sortable={true}
                    description="User's role in the system"
                  >
                    Role
                  </AccessibleTableHeader>
                  
                  <AccessibleTableHeader
                    label="Status"
                    description="User's account status"
                  >
                    Status
                  </AccessibleTableHeader>
                  
                  <AccessibleTableHeader
                    label="Actions"
                    description="Actions available for this user"
                    width="120px"
                  >
                    Actions
                  </AccessibleTableHeader>
                    </tr>
                  </thead>
                
                <tbody>
                  {sampleData.map((row, index) => (
                    <AccessibleTableRow
                      key={row.id}
                      rowIndex={index + 1}
                      totalRows={sampleData.length}
                      selected={selectedRows.has(row.id)}
                      hasActions={true}
                      description={`User ${row.name} with ${row.role} role`}
                    >
                      <AccessibleTableCell
                        colIndex={1}
                        selectable={true}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${row.name}`}
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleRowSelection(row.id)}
                        />
                      </AccessibleTableCell>
                      
                      <AccessibleTableCell
                        colIndex={2}
                      >
                        {row.name}
                      </AccessibleTableCell>
                      
                      <AccessibleTableCell
                        colIndex={3}
                      >
                        {row.email}
                      </AccessibleTableCell>
                      
                      <AccessibleTableCell
                        colIndex={4}
                      >
                        {row.role}
                      </AccessibleTableCell>
                      
                      <AccessibleTableCell
                        colIndex={5}
                      >
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </AccessibleTableCell>
                      
                      <AccessibleTableCell
                        colIndex={6}
                      >
                        <AccessibleButton
                          size="sm"
                          variant="outline"
                          ariaLabel={`Edit ${row.name}`}
                          ariaDescription={`Open edit form for ${row.name}`}
                        >
                          Edit
                        </AccessibleButton>
                      </AccessibleTableCell>
                    </AccessibleTableRow>
                  ))}
                </tbody>
              </AccessibleTable>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Focus Management</CardTitle>
              <CardDescription>
                Advanced focus management with keyboard navigation and focus trapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={focusContainerRef}
                className="border rounded-lg p-4 space-y-4"
                tabIndex={-1}
              >
                <h4 className="text-sm font-medium">Focus Management Demo</h4>
                <p className="text-sm text-muted-foreground">
                  Use Tab, Arrow keys, Home, End, and Escape to navigate. Focus is trapped within this container.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <AccessibleButton
                    ariaLabel="First button"
                    ariaDescription="This is the first focusable element"
                  >
                    First Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    ariaLabel="Second button"
                    ariaDescription="This is the second focusable element"
                  >
                    Second Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    ariaLabel="Third button"
                    ariaDescription="This is the third focusable element"
                  >
                    Third Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    ariaLabel="Fourth button"
                    ariaDescription="This is the fourth focusable element"
                  >
                    Fourth Button
                  </AccessibleButton>
                </div>

                <div className="space-y-2">
                  <AccessibleInput
                    label="Focus Test Input"
                    description="Test input for focus management"
                    placeholder="Type here to test focus"
                  />
                  
                  <AccessibleInput
                    label="Another Input"
                    description="Another test input"
                    placeholder="Another input field"
                  />
                </div>

                <div className="flex gap-2">
                  <AccessibleButton
                    onClick={focusActions.focusFirst}
                    ariaLabel="Focus first element"
                    ariaDescription="Click to focus the first focusable element"
                  >
                    Focus First
                  </AccessibleButton>
                  
                  <AccessibleButton
                    onClick={focusActions.focusLast}
                    ariaLabel="Focus last element"
                    ariaDescription="Click to focus the last focusable element"
                  >
                    Focus Last
                  </AccessibleButton>
                  
                  <AccessibleButton
                    onClick={focusActions.resetFocus}
                    ariaLabel="Reset focus"
                    ariaDescription="Click to reset focus to the first element"
                  >
                    Reset Focus
                  </AccessibleButton>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Focus State:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Has Focus: {focusState.hasFocus ? 'Yes' : 'No'}</li>
                    <li>Focused Index: {focusState.focusedIndex}</li>
                    <li>Total Focusable: {focusState.totalFocusable}</li>
                    <li>Focused Element: {focusState.focusedElement?.textContent || 'None'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">ARIA Labels & Descriptions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comprehensive ARIA attributes</li>
                <li>• Screen reader announcements</li>
                <li>• Contextual descriptions</li>
                <li>• State change notifications</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Keyboard Navigation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Arrow key navigation</li>
                <li>• Tab key management</li>
                <li>• Focus trapping</li>
                <li>• Escape key handling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Focus Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic focus restoration</li>
                <li>• Focus state tracking</li>
                <li>• Focus announcements</li>
                <li>• Focus validation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Screen Reader Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Live region announcements</li>
                <li>• Status updates</li>
                <li>• Error notifications</li>
                <li>• Progress indicators</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 