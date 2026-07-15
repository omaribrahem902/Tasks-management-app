import { SquarePen } from "lucide-react";
import { useProjectStore } from "../stores/useProjectStore";
import { useNavigate } from "react-router";
export interface ProjectTaskProps {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

const ProjectTask = ({ project }: { project: ProjectTaskProps }) => {
  const navigate = useNavigate();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(project.created_at));
  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
 
  const handleClick = () => {
    if (currentProject?.id === project.id) {
      setCurrentProject(null);
    } else {
      setCurrentProject(project);
    }
  };

  const handleEditClick = () => {
    setCurrentProject(project);
    navigate(`/project/${project.id}/edit`);
  }

  return (
    <div
      onClick={handleClick}
      className={`h-55 flex flex-col p-6 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-xl transition-transform hover:scale-110 duration-300 ${currentProject?.id === project.id ? " scale-110 shadow-xl" : ""} `}
    >
      <div className="flex justify-between items-start ">
        <h2 className="title-md mb-6">{project.name}</h2>
        
        <SquarePen onClick={handleEditClick} strokeWidth={1} size={20}/>
        
      </div>
      <p className="body-md slate-4 mb-7 wrap-break-word overflow-hidden">
        {project.description}
      </p>

      <div className="flex justify-between mt-auto">
        <span className="label-sm text-[#737685]">CREATED AT</span>

        <span className="body-md slate-4">{formattedDate}</span>
      </div>
    </div>
  );
};

export default ProjectTask;
