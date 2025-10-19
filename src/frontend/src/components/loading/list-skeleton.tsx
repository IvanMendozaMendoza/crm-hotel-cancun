"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export const ListSkeleton = ({
  items = 5,
  showAvatar = true,
  showActions = false,
  variant = "default",
  className,
}: ListSkeletonProps) => {
  if (variant === "compact") {
    return (
      <div className={className}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 py-2">
            {showAvatar && <Skeleton className="h-8 w-8 rounded-full" />}
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            {showActions && <Skeleton className="h-6 w-16" />}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={className}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-4">
              {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  {showActions && <Skeleton className="h-8 w-20" />}
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex space-x-4 pt-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 py-3">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 