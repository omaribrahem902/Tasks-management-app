import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyProjectPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-11">
      <img
        src="../../public/Empty_project_page.png"
        alt="No projects available"
      />
      <div className="text-center">
        <h1 className="headline-lg mb-4">No Projects </h1>
        <p className="w-fit md:w-[434px] title-md slate-4 wrap-break-word">
          You don’t have any projects yet. Start by defining your first
          architectural workspace to begin tracking tasks and epics.
        </p>
      </div>
      <button
        onClick={() => navigate("/project/add")}
        className="  rounded-lg md:rounded-none flex justify-center items-center gap-1.5 btn px-4 py-4 md:px-6 md:py-3 mb-16 md:mb-0"
      >
        <Plus color="#ffffff" size={20} />{" "}
        <span className="">Create New Project</span>
      </button>
    </div>
  );
};

export default EmptyProjectPage;
