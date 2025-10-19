"use client";

import React, { ComponentType, ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary";

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const { fallback, onError } = options;

  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Set display name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Higher-order component for functional error boundaries
export function withFunctionalErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const { fallback, onError } = options;

  const WrappedComponent = (props: P) => {
    const handleError = (error: Error) => {
      onError?.(error, {} as React.ErrorInfo);
    };

    return (
      <ErrorBoundary fallback={fallback} onError={handleError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withFunctionalErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
} 