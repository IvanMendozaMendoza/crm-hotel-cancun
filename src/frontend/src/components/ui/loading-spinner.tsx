"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoadingConfig } from "@/types/loading";

interface LoadingSpinnerProps extends LoadingConfig {
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const LoadingSpinner = ({
  size = "md",
  showText = false,
  text = "Loading...",
  variant = "default",
  className,
}: LoadingSpinnerProps) => {
  const spinnerClass = cn(
    "animate-spin text-muted-foreground",
    sizeClasses[size],
    className
  );

  const textClass = cn(
    "text-muted-foreground",
    textSizeClasses[size]
  );

  if (variant === "card") {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className={spinnerClass} />
        {showText && <p className={textClass}>{text}</p>}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className={spinnerClass} />
          {showText && <span className={textClass}>{text}</span>}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center space-x-2">
          <Loader2 className={spinnerClass} />
          {showText && <span className={textClass}>{text}</span>}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={spinnerClass} />
      {showText && <span className={textClass}>{text}</span>}
    </div>
  );
}; 