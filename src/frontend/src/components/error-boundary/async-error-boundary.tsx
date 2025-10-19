"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Clock } from "lucide-react";

export interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  retryDelay?: number;
  maxRetries?: number;
}

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
  isRetrying: boolean;
}

export const AsyncErrorBoundary = ({ 
  children, 
  fallback, 
  onError,
  retryDelay = 1000,
  maxRetries = 3
}: AsyncErrorBoundaryProps) => {
  const [state, setState] = useState<AsyncErrorBoundaryState>({
    hasError: false,
    retryCount: 0,
    isRetrying: false,
  });

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      setState(prev => ({ ...prev, hasError: true, error }));
      onError?.(error);
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      const error = event.error || new Error(event.message || "Unknown error");
      setState(prev => ({ ...prev, hasError: true, error }));
      onError?.(error);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, [onError]);

  const handleRetry = async () => {
    if (state.retryCount >= maxRetries) {
      setState(prev => ({ ...prev, hasError: false, retryCount: 0 }));
      return;
    }

    setState(prev => ({ ...prev, isRetrying: true }));
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    setState(prev => ({ 
      ...prev, 
      hasError: false, 
      retryCount: prev.retryCount + 1,
      isRetrying: false 
    }));
  };

  const handleReset = () => {
    setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
      isRetrying: false,
    });
  };

  if (state.hasError) {
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
            <CardTitle className="text-xl">Operation Failed</CardTitle>
            <CardDescription>
              {state.retryCount >= maxRetries 
                ? "Maximum retry attempts reached. Please try again later."
                : "An operation failed. You can retry or reset the operation."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && state.error && (
              <details className="rounded-md bg-muted p-3 text-sm">
                <summary className="cursor-pointer font-medium text-muted-foreground">
                  Error Details (Development)
                </summary>
                <div className="mt-2">
                  <strong>Error:</strong> {state.error.message}
                  <br />
                  <strong>Retry Count:</strong> {state.retryCount}/{maxRetries}
                </div>
              </details>
            )}
            
            <div className="flex flex-col gap-2">
              {state.retryCount < maxRetries ? (
                <Button 
                  onClick={handleRetry} 
                  disabled={state.isRetrying}
                  className="w-full"
                >
                  {state.isRetrying ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry ({maxRetries - state.retryCount} attempts left)
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 