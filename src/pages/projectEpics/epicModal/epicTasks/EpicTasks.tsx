import { List, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getEpicTasks } from "./getEpicTasksAPI";
import { useQuery } from "@tanstack/react-query";
import { useSelectedEpicStore } from "../../../../stores/useProjectStore";
import type { Task } from "./EpicTask";
import EpicTask from "./EpicTask";
import TaskSkeleton from "./TaskSkeleton";

const EpicTasks = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const selectedEpic = useSelectedEpicStore((state) => state.selectedEpic);

  const {
    data: tasks,
    isLoading,
    isError, refetch
  } = useQuery({
    queryKey: ["epicTasks", selectedEpic?.id],
    queryFn: () => getEpicTasks(selectedEpic?.id as string),
    enabled: !!selectedEpic?.id,
  });

  const handleAddTask = () => {
    navigate(`/project/${projectId}/tasks/new`);
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {Array.from({ length: 3 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-16 text-center">
        <p className="text-lg font-medium text-gray-800">
          Failed to load tasks
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 primary-container px-4 py-2 text-sm text-white cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  if(tasks.length === 0) {
    return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#F1F3FF] p-6">
          <div className="mb-4 flex h-fit w-fit items-center justify-center rounded-lg bg-[#D7E2FF] p-4">
            <List size={16} color="#041B3C4D" />
          </div>

          <p className="mb-4 text-[16px]">
            No tasks have been added to this epic yet
          </p>

          <button
            onClick={handleAddTask}
            className="btn flex w-fit items-center justify-center gap-1.5 px-6 py-2.5"
          >
            <Plus color="#fff" size={20} />

            <span className="hidden md:block">Add Task</span>
          </button>
        </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>

        <button
          onClick={handleAddTask}
          className="primary flex items-center gap-1 cursor-pointer"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

        <ul className="w-full border rounded-xl overflow-hidden">
          {tasks.map((task: Task) => (
            <EpicTask key={task.id} task={task} />
          ))}
        </ul>
    </div>
  );
};

export default EpicTasks;
