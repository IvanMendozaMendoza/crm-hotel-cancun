"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  layout?: "dashboard" | "form" | "table" | "grid";
  className?: string;
}

export const PageSkeleton = ({
  showHeader = true,
  layout = "dashboard",
  className,
}: PageSkeletonProps) => {
  if (layout === "form") {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-8">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        <div className="max-w-2xl space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex space-x-4 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "table") {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        )}
        
        {/* Table toolbar */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Table */}
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-4 border-b last:border-b-0">
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-32 w-full rounded mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard layout (default)
  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-8">
          <Skeleton className="h-9 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4 mb-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <div>
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 