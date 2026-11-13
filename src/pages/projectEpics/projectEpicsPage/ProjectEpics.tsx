import { useState } from "react";
import { useParams } from "react-router-dom";

import EpicModalContainer from "../epicModal/EpicModalContainer";
import ProjectEpicsHeader from "./ProjectEpicsHeader";
import ProjectEpicsDesktop from "./ProjectEpicsDesktop";
import ProjectEpicsMobile from "./ProjectEpicsMobile";
import { useIsMobile } from "../../../hooks/useIsMobile";

const ProjectEpics = () => {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  if (!projectId) {
    return null;
  }

  return (
    <>
      <ProjectEpicsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isMobile ? (
        <ProjectEpicsMobile
          projectId={projectId}
          searchTerm={searchTerm}
        />
      ) : (
        <ProjectEpicsDesktop
          projectId={projectId}
          searchTerm={searchTerm}
        />
      )}

      <EpicModalContainer />
    </>
  );
};

export default ProjectEpics;