const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full rounded-xl border border-gray-100 border-l-4 border-l-gray-200 bg-white p-4 shadow-sm">

        {/* Name */}
        <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />

      <div className="flex items-center justify-between">
        {/* Date */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-gray-200" />
        </div>
      {/* Avatar circle */}
      <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
};

export default CardSkeleton;