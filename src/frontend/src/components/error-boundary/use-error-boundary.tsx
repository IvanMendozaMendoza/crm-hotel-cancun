"use client";

import { useState, useCallback, useEffect } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const useErrorBoundary = () => {
  const [state, setState] = useState<ErrorBoundaryState>({ hasError: false });

  const resetError = useCallback(() => {
    setState({ hasError: false, error: undefined });
  }, []);

  const setError = useCallback((error: Error) => {
    setState({ hasError: true, error });
  }, []);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError(new Error(event.reason?.message || "Unhandled promise rejection"));
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      setError(event.error || new Error(event.message || "Unknown error"));
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, [setError]);

  return {
    hasError: state.hasError,
    error: state.error,
    resetError,
    setError,
  };
}; 