interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'grid';
  count?: number;
}

export function LoadingSkeleton({ variant = 'card', count = 8 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border overflow-hidden">
            <div className="aspect-[4/3] bg-muted animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null ;
}
