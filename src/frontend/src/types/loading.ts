export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T = unknown> {
  state: LoadingState;
  data?: T;
  error?: Error;
}

export interface LoadingConfig {
  showText?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "card" | "table" | "list";
}

export interface SkeletonConfig {
  rows?: number;
  columns?: number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}
