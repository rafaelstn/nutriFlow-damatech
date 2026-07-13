import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Skeletons espelham a forma final do conteúdo, para a tela não "saltar". */

export function CardListSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-card flex gap-3 p-3">
          <Skeleton className="h-20 w-24 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-3.5 w-4/5 rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-2.5 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-card overflow-hidden">
          <Skeleton className="h-28 w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-3.5 w-4/5 rounded-full" />
            <Skeleton className="h-2.5 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="surface-card space-y-3 p-4">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-2.5 w-1/2 rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-card flex items-center gap-3 p-3.5">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2 rounded-full" />
            <Skeleton className="h-2.5 w-1/4 rounded-full" />
          </div>
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-3 px-4">
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-5/6 rounded-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
