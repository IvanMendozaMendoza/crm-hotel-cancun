"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LoadingSpinner,
  TableSkeleton,
  CardSkeleton,
  NavigationSkeleton,
  ListSkeleton,
  PageSkeleton,
} from "@/components/loading";
import { useAsyncState } from "@/hooks/use-async-state";

// Simulate async operations
const simulateApiCall = (delay: number = 2000): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Data loaded successfully!"), delay);
  });
};

const simulateFailingApiCall = (delay: number = 1000): Promise<string> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("API call failed")), delay);
  });
};

export const LoadingDemo = () => {
  const [showLoadingStates, setShowLoadingStates] = useState({
    spinner: false,
    table: false,
    cards: false,
    navigation: false,
    list: false,
    page: false,
  });

  const asyncState = useAsyncState<string>();

  const handleAsyncOperation = async () => {
    await asyncState.execute(() => simulateApiCall(3000), {
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.error("Error:", error),
    });
  };

  const handleFailingOperation = async () => {
    await asyncState.execute(() => simulateFailingApiCall(1500));
  };

  const toggleLoadingState = (key: keyof typeof showLoadingStates) => {
    setShowLoadingStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Loading States Demo</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive loading states and skeleton components showcase
        </p>
      </div>

      <Tabs defaultValue="spinners" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spinners">Spinners</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="async">Async States</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="spinners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Spinners</CardTitle>
              <CardDescription>Different spinner sizes and variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Sizes</h4>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <LoadingSpinner size="sm" showText text="Small" />
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" showText text="Medium" />
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" showText text="Large" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Variants</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <LoadingSpinner variant="default" showText text="Default" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <LoadingSpinner variant="card" showText text="Card Variant" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <LoadingSpinner variant="table" showText text="Table Variant" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <LoadingSpinner variant="list" showText text="List Variant" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skeletons" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Table Skeleton</CardTitle>
                <CardDescription>Loading state for data tables</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => toggleLoadingState('table')}
                  className="mb-4"
                >
                  {showLoadingStates.table ? 'Hide' : 'Show'} Table Skeleton
                </Button>
                {showLoadingStates.table && (
                  <TableSkeleton rows={5} columns={6} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Skeletons</CardTitle>
                <CardDescription>Loading states for card-based content</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => toggleLoadingState('cards')}
                  className="mb-4"
                >
                  {showLoadingStates.cards ? 'Hide' : 'Show'} Card Skeletons
                </Button>
                {showLoadingStates.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CardSkeleton variant="default" />
                    <CardSkeleton variant="compact" />
                    <CardSkeleton variant="detailed" showFooter />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>List Skeleton</CardTitle>
                <CardDescription>Loading states for list content</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => toggleLoadingState('list')}
                  className="mb-4"
                >
                  {showLoadingStates.list ? 'Hide' : 'Show'} List Skeleton
                </Button>
                {showLoadingStates.list && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Default</h5>
                      <ListSkeleton items={3} />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Compact</h5>
                      <ListSkeleton items={3} variant="compact" showActions />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Detailed</h5>
                      <ListSkeleton items={2} variant="detailed" showActions />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation Skeleton</CardTitle>
                <CardDescription>Loading state for sidebar navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => toggleLoadingState('navigation')}
                  className="mb-4"
                >
                  {showLoadingStates.navigation ? 'Hide' : 'Show'} Navigation Skeleton
                </Button>
                {showLoadingStates.navigation && (
                  <div className="max-w-xs border rounded-lg">
                    <NavigationSkeleton items={6} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="async" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Async State Management</CardTitle>
              <CardDescription>useAsyncState hook demonstration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAsyncOperation}
                  disabled={asyncState.isLoading}
                >
                  Simulate Success
                </Button>
                <Button 
                  onClick={handleFailingOperation}
                  disabled={asyncState.isLoading}
                  variant="destructive"
                >
                  Simulate Error
                </Button>
                <Button 
                  onClick={asyncState.reset}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="mb-2">
                  <strong>State:</strong> {asyncState.state}
                </div>
                
                {asyncState.isLoading && (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                  </div>
                )}
                
                {asyncState.isSuccess && asyncState.data && (
                  <div className="text-green-600">
                    Success: {asyncState.data}
                  </div>
                )}
                
                {asyncState.isError && asyncState.error && (
                  <div className="text-red-600">
                    Error: {asyncState.error.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Skeletons</CardTitle>
              <CardDescription>Full page loading layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => toggleLoadingState('page')}
                className="mb-4"
              >
                {showLoadingStates.page ? 'Hide' : 'Show'} Page Skeleton
              </Button>
              {showLoadingStates.page && (
                <div className="border rounded-lg p-4">
                  <PageSkeleton layout="dashboard" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-medium">Loading Spinners</h5>
                  <p className="text-muted-foreground">Use for short operations (&lt; 2 seconds) and user-initiated actions</p>
                </div>
                <div>
                  <h5 className="font-medium">Skeleton Components</h5>
                  <p className="text-muted-foreground">Use for initial page loads and data fetching operations</p>
                </div>
                <div>
                  <h5 className="font-medium">Async State Hook</h5>
                  <p className="text-muted-foreground">Use useAsyncState for managing complex async operations with proper error handling</p>
                </div>
                <div>
                  <h5 className="font-medium">Error States</h5>
                  <p className="text-muted-foreground">Always provide fallback UI with retry options for failed operations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 