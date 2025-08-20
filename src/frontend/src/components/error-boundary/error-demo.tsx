"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "./error-boundary";
import { useErrorHandler, useComponentErrorHandler } from "@/hooks/use-error-handler";

// Component that intentionally throws an error
const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("This is a simulated error for testing error boundaries!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buggy Component</CardTitle>
        <CardDescription>
          This component can simulate errors to test error boundaries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setShouldThrow(true)} variant="destructive">
          Simulate Error
        </Button>
      </CardContent>
    </Card>
  );
};

// Component that demonstrates error handling hooks
const ErrorHandlingDemo = () => {
  const { handleError, handleAsyncError } = useErrorHandler();
  const { handleComponentError, handleComponentAsyncError } = useComponentErrorHandler("ErrorHandlingDemo");

  const simulateSyncError = () => {
    try {
      throw new Error("Synchronous error example");
    } catch (error) {
      handleError(error as Error, "Manual sync error");
    }
  };

  const simulateAsyncError = async () => {
    await handleAsyncError(async () => {
      throw new Error("Asynchronous error example");
    }, "Manual async error");
  };

  const simulateComponentError = () => {
    try {
      throw new Error("Component-specific error");
    } catch (error) {
      handleComponentError(error as Error, { action: "simulateComponentError" });
    }
  };

  const simulateComponentAsyncError = async () => {
    await handleComponentAsyncError(async () => {
      throw new Error("Component-specific async error");
    }, { action: "simulateComponentAsyncError" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Handling Hooks Demo</CardTitle>
        <CardDescription>
          Test different error handling scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={simulateSyncError} variant="outline">
            Sync Error
          </Button>
          <Button onClick={simulateAsyncError} variant="outline">
            Async Error
          </Button>
          <Button onClick={simulateComponentError} variant="outline">
            Component Error
          </Button>
          <Button onClick={simulateComponentAsyncError} variant="outline">
            Component Async Error
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main demo component
export const ErrorBoundaryDemo = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Error Boundary Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test error boundaries and error handling in different scenarios
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Component wrapped with error boundary */}
        <ErrorBoundary
          fallback={
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error Caught!</CardTitle>
                <CardDescription>
                  The buggy component threw an error, but the error boundary caught it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </CardContent>
            </Card>
          }
        >
          <BuggyComponent />
        </ErrorBoundary>

        {/* Error handling hooks demo */}
        <ErrorHandlingDemo />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Boundary Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Class-based Error Boundary:</strong> Catches JavaScript errors in component trees</li>
            <li><strong>Functional Error Boundary:</strong> Modern React pattern using hooks</li>
            <li><strong>Async Error Boundary:</strong> Handles promise rejections and async errors</li>
            <li><strong>Error Handling Hooks:</strong> Utilities for manual error handling</li>
            <li><strong>Global Error Handler:</strong> Catches unhandled errors and promise rejections</li>
            <li><strong>Custom Fallback UI:</strong> Beautiful error pages with retry options</li>
            <li><strong>Development Mode:</strong> Shows detailed error information in development</li>
            <li><strong>Production Ready:</strong> Clean error pages in production with monitoring integration</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}; 