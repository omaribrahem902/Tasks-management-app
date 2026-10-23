import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getEpicDetails } from "./GetEpicDetailsAPI";
import ErrorPage from "../../ErrorPage";
import { useProjectMembers } from "../../../hooks/useProjectMembers";

import EpicModalHeader from "./EpicModalHeader";
import EpicInfo from "./EpicModalInfo";
import EpicTasks from "./epicTasks/EpicTasks";
import { TaskModalContainer } from "../../projectTasksPage/taskModal";

export interface ModalProps {
  selectedEpicId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EpicModal = ({ selectedEpicId, isOpen, onClose }: ModalProps) => {
  const { projectId } = useParams<{ projectId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["epicDetails", projectId, selectedEpicId],
    queryFn: () => getEpicDetails(projectId as string, selectedEpicId),
    enabled: Boolean(isOpen && projectId && selectedEpicId),
  });

  const { data: members = [] } = useProjectMembers(projectId!);

  const epic = data?.[0];

  if (!isOpen) return null;

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorPage />
      </div>
    );
  }

  if (!epic) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-2xl overflow-y-scroll rounded-sm bg-white p-6 shadow-2xl lg:p-8"
      >
        <EpicModalHeader epicId={epic.epic_id} onClose={onClose} />

        <EpicInfo key={epic.epic_id} epic={epic} members={members} projectId={projectId} />
        
        <EpicTasks  />

        {/* Task Details Popup */}
        <TaskModalContainer />
      </div>
    </div>
  );
};

export default EpicModal;
