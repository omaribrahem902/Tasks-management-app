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

  if (!projectId) {
    return null;
  }

  return (
    <>
      <ProjectEpicsHeader />

      {isMobile ? (
        <ProjectEpicsMobile
          projectId={projectId}
        />
      ) : (
        <ProjectEpicsDesktop
          projectId={projectId}
        />
      )}

      <EpicModalContainer />
    </>
  );
};

export default ProjectEpics;