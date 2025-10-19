"use client";

import React from "react";
import { ErrorBoundary } from "./error-boundary";

export interface ClientErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientErrorBoundary = ({ children, fallback }: ClientErrorBoundaryProps) => {
  const handleError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ClientErrorBoundary caught an error:", error, errorInfo);
    }
    
    // In production, you would typically send to your error monitoring service
    // e.g., Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      console.error("Production error:", error, errorInfo);
    }
  }, []);

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}; 