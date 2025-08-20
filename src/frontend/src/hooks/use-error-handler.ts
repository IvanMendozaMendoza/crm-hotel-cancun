"use client";

import { useCallback } from "react";
import { errorHandler, logError, logErrorWithContext } from "@/lib/error-handler";

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, context?: string) => {
    logError(error, context);
  }, []);

  const handleErrorWithContext = useCallback((
    error: Error, 
    componentName: string, 
    props?: Record<string, unknown>
  ) => {
    logErrorWithContext(error, componentName, props);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      handleError(errorObj, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleErrorWithContext,
    handleAsyncError,
    errorHandler,
  };
};

// Hook for wrapping async operations with error handling
export const useAsyncErrorHandler = () => {
  const { handleAsyncError } = useErrorHandler();

  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    return handleAsyncError(asyncFn, context);
  }, [handleAsyncError]);

  return { withErrorHandling };
};

// Hook for component-specific error handling
export const useComponentErrorHandler = (componentName: string) => {
  const { handleErrorWithContext } = useErrorHandler();

  const handleComponentError = useCallback((error: Error, props?: Record<string, unknown>) => {
    handleErrorWithContext(error, componentName, props);
  }, [componentName, handleErrorWithContext]);

  const handleComponentAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    props?: Record<string, unknown>
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      handleComponentError(errorObj, props);
      return null;
    }
  }, [handleComponentError]);

  return {
    handleComponentError,
    handleComponentAsyncError,
  };
}; 