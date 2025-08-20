"use client";

import React, { ReactNode } from "react";
import { useErrorBoundary } from "./use-error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export interface FunctionalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export const FunctionalErrorBoundary = ({ 
  children, 
  fallback, 
  onError 
}: FunctionalErrorBoundaryProps) => {
  const { hasError, error, resetError } = useErrorBoundary();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleRetry = () => {
    resetError();
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (hasError) {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && error && (
              <details className="rounded-md bg-muted p-3 text-sm">
                <summary className="cursor-pointer font-medium text-muted-foreground">
                  Error Details (Development)
                </summary>
                <div className="mt-2">
                  <strong>Error:</strong> {error.message}
                </div>
              </details>
            )}
            
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={handleRetry} className="flex-1 sm:flex-none">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={handleGoBack} className="flex-1 sm:flex-none">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="outline" onClick={handleGoHome} className="flex-1 sm:flex-none">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 