import { Calendar, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import BoxName from "../../components/BoxName";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { formatDate } from "../../utils/formatDate";
import { useSelectedTaskStore } from "../../stores/useProjectStore";

interface TaskBoardViewProps {
  task: Task;
  color?: string;
  projectId?: string;
}

const STATUS_MAP: Record<string, string> = {
  TO_DO: "#3B82F6",
  IN_PROGRESS: "#EAB308",
  BLOCKED: "#EF4444",
  IN_REVIEW: "#A855F7",
  READY_FOR_QA: "#14B8A6",
  REOPENED: "#F97316",
  READY_FOR_PRODUCTION: "#EC4899",
  DONE: "#22C55E",
};

const TaskBoardView = ({
  task,
  color,
  projectId: propProjectId,
}: TaskBoardViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { projectId: paramsProjectId } = useParams<{ projectId: string }>();
  const setSelectedTask = useSelectedTaskStore((s) => s.setSelectedTask);

  const finalProjectId = propProjectId || paramsProjectId || task.project_id;
  const assigneeName = task.assignee?.name || "";
  const statusColor = color || STATUS_MAP[task.status] || "#CBD5E1";

  // Register as draggable
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({
        type: "task",
        taskId: task.id,
        fromStatus: task.status,
        task,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [task]);

  const handleClick = () => {
    if (isDragging) return; // منع فتح المودال أثناء السحب
    if (task.id && finalProjectId) {
      setSelectedTask({ taskId: task.id, projectId: finalProjectId });
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`flex h-[107px] w-full flex-col gap-4 rounded-md border-l-4 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing md:w-[288px] ${
        isDragging ? "opacity-40" : ""
      }`}
      style={{ borderLeftColor: statusColor }}
    >
      <div className="flex items-center justify-between gap-2">
        <h3
          className={`line-clamp-2 font-medium text-slate-800 ${
            task.status === "DONE" ? "text-slate-400 line-through" : ""
          }`}
        >
          {task.title}
        </h3>
        <span
          style={{ backgroundColor: statusColor }}
          className="shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-medium text-white"
        >
          {task.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1 capitalize">
          {task.status === "DONE" ? (
            <>
              <CircleCheck strokeWidth={1.5} size={14} color="#004E32" />
              <span className="text-xs font-semibold uppercase text-[#004E32]">
                Completed
              </span>
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
          <span className="text-xs italic text-slate-400">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export default TaskBoardView;