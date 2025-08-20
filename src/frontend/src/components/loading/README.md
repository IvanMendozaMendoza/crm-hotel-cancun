# Loading States & Skeleton Components

This directory contains a comprehensive set of loading states and skeleton components built with Shadcn UI, designed to provide consistent loading patterns across the application.

## Components Overview

### 1. LoadingSpinner
A flexible loading spinner component with different sizes and variants.

```tsx
import { LoadingSpinner } from "@/components/loading";

// Basic usage
<LoadingSpinner />

// With custom text and size
<LoadingSpinner 
  size="lg" 
  showText 
  text="Loading data..." 
  variant="card" 
/>
```

**Props:**
- `size`: "sm" | "md" | "lg" - Controls spinner size
- `showText`: boolean - Whether to show loading text
- `text`: string - Custom loading text
- `variant`: "default" | "card" | "table" | "list" - Layout variant
- `className`: string - Additional CSS classes

### 2. Skeleton Components

#### TableSkeleton
Loading state for data tables with configurable rows and columns.

```tsx
import { TableSkeleton } from "@/components/loading";

<TableSkeleton rows={5} columns={6} showHeader={true} />
```

#### CardSkeleton
Loading state for card-based content with multiple variants.

```tsx
import { CardSkeleton } from "@/components/loading";

// Default variant
<CardSkeleton />

// Compact variant
<CardSkeleton variant="compact" />

// Detailed variant with footer
<CardSkeleton variant="detailed" showFooter lines={4} />
```

#### NavigationSkeleton
Loading state for sidebar navigation.

```tsx
import { NavigationSkeleton } from "@/components/loading";

<NavigationSkeleton items={6} showQuickCreate={true} />
```

#### ListSkeleton
Loading state for list content with different variants.

```tsx
import { ListSkeleton } from "@/components/loading";

// Default variant
<ListSkeleton items={5} />

// Compact with actions
<ListSkeleton items={3} variant="compact" showActions />

// Detailed variant
<ListSkeleton items={4} variant="detailed" showAvatar showActions />
```

#### PageSkeleton
Full page loading layouts for different page types.

```tsx
import { PageSkeleton } from "@/components/loading";

// Dashboard layout
<PageSkeleton layout="dashboard" />

// Table layout
<PageSkeleton layout="table" />

// Form layout
<PageSkeleton layout="form" />

// Grid layout
<PageSkeleton layout="grid" />
```

### 3. LoadingWrapper
A wrapper component that handles loading, error, and success states.

```tsx
import { LoadingWrapper } from "@/components/loading";

<LoadingWrapper 
  isLoading={isLoading} 
  error={error}
  fallback={<CustomLoadingUI />}
  errorFallback={<CustomErrorUI />}
>
  <YourContent />
</LoadingWrapper>
```

## Hooks

### useAsyncState
A custom hook for managing async operations with built-in loading states.

```tsx
import { useAsyncState } from "@/hooks/use-async-state";

const MyComponent = () => {
  const asyncState = useAsyncState<string>();

  const handleFetch = async () => {
    await asyncState.execute(async (signal) => {
      const response = await fetch('/api/data', { signal });
      return response.json();
    }, {
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error),
      preserveData: true, // Keep previous data while loading
    });
  };

  return (
    <div>
      {asyncState.isLoading && <LoadingSpinner />}
      {asyncState.isError && <div>Error: {asyncState.error?.message}</div>}
      {asyncState.isSuccess && <div>Data: {asyncState.data}</div>}
      <button onClick={handleFetch} disabled={asyncState.isLoading}>
        Fetch Data
      </button>
    </div>
  );
};
```

## Implementation Patterns

### 1. Data Fetching with Loading States

```tsx
const DataComponent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await api.getData();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <TableSkeleton rows={8} columns={6} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <DataTable data={data} />;
};
```

### 2. Using LoadingWrapper

```tsx
const UserProfile = () => {
  const { data: user, isLoading, error } = useUser();

  return (
    <LoadingWrapper 
      isLoading={isLoading} 
      error={error}
      fallback={<CardSkeleton variant="detailed" />}
    >
      <UserCard user={user} />
    </LoadingWrapper>
  );
};
```

### 3. Form Loading States

```tsx
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitForm(data);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoadingSpinner size="sm" />
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
};
```

## Best Practices

### 1. Loading State Timing
- **< 2 seconds**: Use loading spinners
- **2-5 seconds**: Use skeleton components
- **> 5 seconds**: Consider progress bars or more detailed loading states

### 2. Error Handling
- Always provide fallback UI for errors
- Include retry mechanisms when appropriate
- Show user-friendly error messages
- Log errors for debugging

### 3. Performance
- Use skeleton components for initial page loads
- Implement progressive loading for large datasets
- Consider lazy loading for non-critical content

### 4. Accessibility
- Provide loading text for screen readers
- Use appropriate ARIA attributes
- Ensure keyboard navigation works during loading

## Customization

All skeleton components can be customized using Tailwind CSS classes:

```tsx
<TableSkeleton 
  className="border-2 border-blue-200" 
  rows={10} 
  columns={8} 
/>
```

## Demo

See `LoadingDemo` component for a comprehensive showcase of all loading states and components.

## Migration Guide

### From Basic Loading States
```tsx
// Before
{isLoading && <div>Loading...</div>}

// After
{isLoading && <LoadingSpinner showText text="Loading..." />}
```

### From Custom Skeletons
```tsx
// Before
{isLoading && (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)}

// After
{isLoading && <ListSkeleton items={2} />}
```

This loading system provides a consistent, accessible, and performant way to handle loading states throughout your application. 