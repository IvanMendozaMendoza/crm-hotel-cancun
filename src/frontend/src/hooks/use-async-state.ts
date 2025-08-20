"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AsyncState } from "@/types/loading";

export const useAsyncState = <T = unknown>(initialData?: T) => {
  const [state, setState] = useState<AsyncState<T>>({
    state: "idle",
    data: initialData,
    error: undefined,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async <R = T>(
    asyncFn: (signal?: AbortSignal) => Promise<R>,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: Error) => void;
      preserveData?: boolean;
    }
  ): Promise<R | null> => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState(prev => ({
      ...prev,
      state: "loading",
      error: undefined,
      ...(options?.preserveData ? {} : { data: undefined }),
    }));

    try {
      const result = await asyncFn(signal);
      
      // Check if request was aborted
      if (signal.aborted) {
        return null;
      }

      setState({
        state: "success",
        data: result as T,
        error: undefined,
      });

      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      // Don't update state if request was aborted
      if (signal.aborted) {
        return null;
      }

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setState(prev => ({
        ...prev,
        state: "error",
        error: errorObj,
      }));

      options?.onError?.(errorObj);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      state: "idle",
      data: initialData,
      error: undefined,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      state: "success",
      error: undefined,
    }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      error,
      state: "error",
    }));
  }, []);

  const setLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      state: "loading",
      error: undefined,
    }));
  }, []);

  return {
    ...state,
    isLoading: state.state === "loading",
    isSuccess: state.state === "success",
    isError: state.state === "error",
    isIdle: state.state === "idle",
    execute,
    reset,
    setData,
    setError,
    setLoading,
  };
}; 