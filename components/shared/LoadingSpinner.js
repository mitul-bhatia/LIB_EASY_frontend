import { Skeleton } from "@/components/ui/skeleton";

// Simple loading state using shadcn Skeleton
export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

// For loading cards/lists
export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
