export interface ProjectTaskProps {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

const ProjectTask = ({
  project,
}: {
  project: ProjectTaskProps;
}) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(project.created_at));

  return (
    <div className="h-55 flex flex-col p-6 bg-white rounded-lg shadow-sm">
      <h2 className="title-md mb-6">
        {project.name}
      </h2>

      <p className="body-md slate-4 mb-7 wrap-break-word overflow-hidden">
        {project.description}
      </p>

      <div className="flex justify-between mt-auto">
        <span className="label-sm text-[#737685]">
          CREATED AT
        </span>

        <span className="body-md slate-4">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default ProjectTask;