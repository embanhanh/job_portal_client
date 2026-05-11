"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function JobSkeleton() {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex gap-4 items-start">
        <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32 rounded-md" />
      </div>
    </div>
  );
}

export function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <JobSkeleton key={i} />
      ))}
    </div>
  );
}
