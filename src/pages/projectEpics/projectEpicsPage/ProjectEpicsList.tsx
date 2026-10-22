import Epic from "./Epic";
import type { epic } from "./Epic";

interface ProjectEpicsListProps {
  epics: epic[];
}

const ProjectEpicsList = ({
  epics,
}: ProjectEpicsListProps) => {
  return (
    <div className="mb-16 grid gap-6 md:mb-8 lg:grid-cols-2">
      {epics.map((epic) => (
        <Epic
          key={epic.epic_id}
          epic={epic}
        />
      ))}
    </div>
  );
};

export default ProjectEpicsList;