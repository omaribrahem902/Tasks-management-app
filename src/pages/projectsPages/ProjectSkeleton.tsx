const ProjectSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
      {/* Image */}
      <div className="h-40 w-full rounded-lg bg-[#E8EDFF]"></div>

      {/* Title */}
      <div className="mt-6 h-5 w-3/4 rounded bg-[#E8EDFF]"></div>

      {/* Description */}
      <div className="mt-4 space-y-3">
        <div className="h-4 w-2/4 rounded bg-[#E8EDFF]"></div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;