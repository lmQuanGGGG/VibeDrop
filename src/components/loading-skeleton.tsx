"use client";

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6 p-8 max-sm:p-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-48 bg-neutral-200 border-2 border-neutral-300" />
        <div className="h-6 w-24 bg-neutral-100 border border-neutral-200" />
      </div>

      {/* Card skeletons */}
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-4 border-neutral-200 bg-white overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="h-48 sm:h-64 bg-neutral-100 border-b-4 border-neutral-200" />
            {/* Content placeholder */}
            <div className="p-4 sm:p-6 flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-neutral-200" />
                <div className="h-5 w-16 bg-neutral-100" />
              </div>
              <div className="h-7 w-3/4 bg-neutral-200" />
              <div className="h-4 w-1/3 bg-neutral-100" />
              <div className="space-y-2 mt-2">
                <div className="h-3 w-full bg-neutral-100" />
                <div className="h-3 w-5/6 bg-neutral-100" />
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t-2 border-neutral-200">
                <div className="h-8 w-20 bg-neutral-200" />
                <div className="h-8 w-16 bg-neutral-200" />
                <div className="h-8 w-16 bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent overflow-hidden">
      <div
        className="h-full bg-[#c8f560] animate-loading-bar"
        style={{
          animation: "loading-bar 1.2s ease-in-out infinite",
        }}
      />
    </div>
  );
}
