const TaskSkeleton = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-5 last:border-b-0">
      {/* Left side: Title + Assignee */}
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="h-5 w-64 animate-pulse rounded-md bg-gray-200" />

        {/* Avatar + Name */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Right side: Due Date */}
      <div className="flex flex-col items-end gap-2">
        <div className="h-3 w-16 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

export default TaskSkeleton;