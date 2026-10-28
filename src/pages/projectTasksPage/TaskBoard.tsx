import { Calendar, CircleCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import BoxName from "../../components/BoxName";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { formatDate } from "../../utils/formatDate";
import { useSelectedTaskStore } from "../../stores/useProjectStore";

interface TaskBoardViewProps {
  task: Task;
  color?: string;
  projectId?: string;
}

const STATUS_MAP = {
  TO_DO: "#3B82F6",
  IN_PROGRESS: "#EAB308",
  BLOCKED: "#EF4444",
  IN_REVIEW: "#A855F7",
  READY_FOR_QA: "#14B8A6",
  REOPENED: "#F97316",
  READY_FOR_PRODUCTION: "#EC4899",
  DONE: "#22C55E",
};

const TaskBoardView = ({ task, color, projectId: propProjectId }: TaskBoardViewProps) => {
  const { projectId: paramsProjectId } = useParams<{ projectId: string }>();
  const setSelectedTask = useSelectedTaskStore((state) => state.setSelectedTask);

  const finalProjectId = propProjectId || paramsProjectId || task.project_id;
  const assigneeName =  task.assignee.name || "";
  const statusColor = color || STATUS_MAP[task.status];

  const handleClick = () => {
    if (task.id && finalProjectId) {
      setSelectedTask({
        taskId: task.id,
        projectId: finalProjectId,
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="flex w-full h-[107px] md:w-[288px] flex-col gap-4 rounded-md border-l-4 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:border-slate-300"
      style={{ borderLeftColor: statusColor }}
    >
      <div className="flex justify-between items-center gap-2">
        <h3
          className={`font-medium text-slate-800 line-clamp-2 ${
            task.status === "DONE" ? "line-through text-slate-400" : ""
          }`}
        >
          {task.title}
        </h3>
        <span
          style={{ backgroundColor: statusColor }}
          className="text-white px-2 py-0.5 text-[10px] rounded-sm shrink-0 font-medium"
        >
          {task.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1 capitalize">
          {task.status === "DONE" ? (
            <>
              <CircleCheck strokeWidth={1.5} size={14} color="#004E32" />
              <span className="uppercase text-[#004E32] text-xs font-semibold">Completed</span>
            </>
          ) : (
            <>
              <Calendar size={14} />
              <span className="text-xs">{formatDate(task.due_date)}</span>
            </>
          )}
        </span>
        {assigneeName ? (
          <BoxName size={8} name={assigneeName} fontTheme="text-[10px]" />
        ) : (   
          <span className="text-xs text-slate-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export default TaskBoardView;
