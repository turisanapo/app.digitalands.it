export function CardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white animate-pulse">
      <div className="p-4">
        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200" />
      </div>
      <div className="px-6 py-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-1" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-end mt-4">
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
} 