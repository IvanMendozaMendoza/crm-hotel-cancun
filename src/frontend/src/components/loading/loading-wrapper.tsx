"use client";

import React from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import type { LoadingConfig } from "@/types/loading";

interface LoadingWrapperProps extends LoadingConfig {
  children: React.ReactNode;
  isLoading: boolean;
  error?: Error | null;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}

export const LoadingWrapper = ({
  children,
  isLoading,
  error,
  fallback,
  errorFallback,
  className,
  ...loadingConfig
}: LoadingWrapperProps) => {
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className={`flex items-center justify-center p-8 ${className || ""}`}>
        <LoadingSpinner {...loadingConfig} />
      </div>
    );
  }

  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }

    return (
      <div className={`text-center p-8 ${className || ""}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}; 