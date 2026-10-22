import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../../../components/BreadCrumbs";
import SearchBar from "../../../components/SearchBar";

const ProjectEpicsHeader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumb />

      <div className="relative mb-10 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="headline-lg hidden md:block">
            Project Epics
          </h1>

          <SearchBar margin_right={52} />
        </div>

        <button
          onClick={() =>
            navigate(`/project/${projectId}/epics/new`)
          }
          className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:-top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3"
        >
          <Plus color="#fff" size={20} />

          <span className="hidden md:block">
            New Epic
          </span>
        </button>
      </div>
    </>
  );
};

export default ProjectEpicsHeader;