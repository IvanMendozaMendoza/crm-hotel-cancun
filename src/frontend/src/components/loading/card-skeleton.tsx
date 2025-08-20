"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export const CardSkeleton = ({
  showHeader = true,
  showFooter = false,
  lines = 3,
  className,
  variant = "default",
}: CardSkeletonProps) => {
  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="space-y-2">
              {Array.from({ length: lines }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  className={`h-4 ${
                    index === lines - 1 ? "w-2/3" : "w-full"
                  }`} 
                />
              ))}
            </div>
            {showFooter && (
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton 
              key={index} 
              className={`h-4 ${
                index === lines - 1 ? "w-2/3" : "w-full"
              }`} 
            />
          ))}
        </div>
        {showFooter && (
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 