const EpicsPageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-center">
        {/* Left side */}
        <div>
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-3">
            <div className="h-3 w-14 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded bg-slate-200" />
            <div className="h-3 w-10 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded bg-slate-200" />
            <div className="h-3 w-10 rounded bg-slate-200" />
          </div>

          {/* Title */}
          <div className="h-10 w-64 rounded bg-slate-200" />
        </div>

        {/* Search + Button */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-14 w-full rounded bg-slate-200 sm:w-72" />

          <div className="h-14 w-full rounded bg-slate-200 sm:w-44" />
        </div>
      </div>

      {/* Epic Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative min-h-[275px] rounded-xl border-l-4 border-l-slate-200 bg-white p-6 shadow-sm"
          >
            {/* Epic ID + Menu */}
            <div className="mb-6 flex items-start justify-between">
              <div className="h-8 w-20 rounded bg-slate-200" />

              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* Epic title */}
            <div className="mb-6 h-7 w-36 rounded bg-slate-200" />

            {/* Assignee */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="h-15 w-15 rounded-xl bg-slate-200" />

              <div className="flex flex-col gap-3">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
              </div>
            </div>

            {/* Bottom section */}
            <div className="absolute right-6 bottom-6 left-6 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                {/* Created by */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-slate-200" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
                </div>

                {/* Date */}
                <div className="h-4 w-24 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpicsPageSkeleton;