const TaskModalSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-3/4 rounded-md bg-slate-200" />
        <div className="h-5 w-1/2 rounded-md bg-slate-100" />
      </div>

      {/* Badges row skeleton */}
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-24 rounded-full bg-slate-100" />
      </div>

      {/* Description section skeleton */}
      <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/70 p-4">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>

      {/* Metadata grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-slate-100 p-3 bg-white">
            <div className="h-2.5 w-16 rounded bg-slate-200" />
            <div className="flex items-center gap-2 mt-1">
              <div className="h-6 w-6 rounded-full bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskModalSkeleton;
