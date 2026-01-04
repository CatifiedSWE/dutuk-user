interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={`flex flex-col gap-5 bg-white p-4 rounded-3xl shadow-lg animate-pulse ${className || ''}`}>
      {/* Image Skeleton */}
      <div className="h-60 rounded-2xl bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="px-2 pb-2 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function LoadingEventCard() {
  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-lg animate-pulse overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-64 bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded-full w-32" />
      </div>
    </div>
  );
}