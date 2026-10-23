import { CalendarX, Plus } from "lucide-react";
import TaskBoardView from "./TaskBoard";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "./getProjectTasksAPI";
import { useNavigate } from "react-router-dom";
import CardSkeleton from "./CardSkeleton";

interface ColumnViewProps {
  projectId?: string;
  status?: string;
  title?: string;
  color?: string;
  tasks?: Task[];
  count?: number;
}

const ColumnView = ({
  projectId,
  status,
  title,
  color,
  tasks: tasksProp,
  count: countProp,
}: ColumnViewProps) => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectTasks", projectId, status],
    queryFn: () => getProjectTasks(projectId as string, status as string),
    enabled: Boolean(projectId && status && !tasksProp),
  });

  const tasks: Task[] =
    tasksProp ?? (Array.isArray(data) ? data : data?.tasks ?? []);
  const count = countProp ?? tasks.length;
  const hasTasks = count > 0;

  return (
    <div
      className={`${
        hasTasks ? "flex" : "hidden md:flex"
      } w-full md:w-auto min-w-[288px] flex-col gap-4 mb-4`}
    >
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center">
          <div
            style={{ backgroundColor: color }}
            className="w-2 h-2 rounded-full"
          />
          <span className="ml-2 text-sm font-medium">{title}</span>
          <span className="ml-2 text-xs bg-[#E0E8FF] py-1 px-2">
            {isLoading ? "..." : count}
          </span>
        </div>
        <Plus
          size={12}
          className="ml-auto cursor-pointer"
          onClick={() => {
            if (projectId) {
              navigate(`/project/${projectId}/tasks/new`);
            }
          }}
        />
      </div>

      {isLoading ? (
        <div className="hidden md:flex flex-col gap-3">
          <CardSkeleton/> 
          <CardSkeleton/> 
        </div>
      ) : isError ? (
        <div className="hidden md:flex flex-col items-center justify-center p-4 text-xs text-red-500 border border-red-200 border-dashed rounded-md">
          Failed to load tasks
        </div>
      ) : hasTasks ? (
        tasks.map((task) => (
          <TaskBoardView
            task={task}
            color={color}
            projectId={projectId}
            key={task.id}
          />
        ))
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center gap-2 text-slate-500 uppercase border border-[#cbd5e1] border-dashed rounded-md p-3">
          <CalendarX strokeWidth={1.5} size={30} />
           <p className="text-sm text-slate-400 mb-6">
          NO TASKS.
        </p>
        </div>
      )}
    </div>
  );
};

export default ColumnView;