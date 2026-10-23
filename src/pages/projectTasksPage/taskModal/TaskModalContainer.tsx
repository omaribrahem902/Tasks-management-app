import TaskModal from "./TaskModal";
import { useSelectedTaskStore } from "../../../stores/useProjectStore";

const TaskModalContainer = () => {
  const selectedTask = useSelectedTaskStore((state) => state.selectedTask);
  const clearSelectedTask = useSelectedTaskStore((state) => state.clearSelectedTask);

  if (!selectedTask) return null;

  return (
    <TaskModal
      isOpen={true}
      taskId={selectedTask.taskId}
      projectId={selectedTask.projectId}
      onClose={clearSelectedTask}
    />
  );
};

export default TaskModalContainer;
