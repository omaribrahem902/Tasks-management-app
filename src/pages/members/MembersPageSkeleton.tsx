const MembersPageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="hidden lg:flex mb-4 items-center gap-2">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="h-3 w-2 rounded bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="h-3 w-2 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>

      {/* Title + Button */}
      <div className="mb-3 lg:mb-12 flex items-center justify-center lg:justify-between">
        <div className="h-10 w-72 rounded bg-gray-200" />

        <div className="hidden lg:block h-12 w-48 bg-gray-200" />
      </div>

      {/* Table */}
      <div className="flex justify-center">
      <div className="w-[400px] lg:w-[785px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_80px] items-center bg-gray-50 px-8 py-5">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>

        {/* Rows */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_80px] items-center border-t border-gray-100 px-8 py-6"
          >
            {/* Member */}
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="h-3 w-52 rounded bg-gray-200" />
              </div>
            </div>

            {/* Role */}
            <div>
              <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MembersPageSkeleton;