import { Calendar, EllipsisVertical, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProjectTasks } from "./getProjectTasksAPI";
import { formatDate } from "../../utils/formatDate";
import BoxName from "../../components/BoxName";
import Pagination from "../../components/Pagination";
import ListViewSkeleton from "./ListViewSkeleton";

export interface ProjectTaskItem {
  id: string;
  task_id?: string;
  title: string;
  status: string;
  due_date: string | null;
  assignee?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  created_at?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  TO_DO: { label: "To Do", color: "#3B82F6", bg: "bg-blue-50" },
  IN_PROGRESS: { label: "In Progress", color: "#EAB308", bg: "bg-amber-50" },
  BLOCKED: { label: "Blocked", color: "#EF4444", bg: "bg-red-50" },
  IN_REVIEW: { label: "In Review", color: "#A855F7", bg: "bg-purple-50" },
  READY_FOR_QA: { label: "Ready for QA", color: "#14B8A6", bg: "bg-teal-50" },
  REOPENED: { label: "Reopened", color: "#F97316", bg: "bg-orange-50" },
  READY_FOR_PRODUCTION: {
    label: "Ready for Production",
    color: "#EC4899",
    bg: "bg-pink-50",
  },
  DONE: { label: "Done", color: "#22C55E", bg: "bg-emerald-50" },
};

interface TaskListViewProps {
  projectId: string;
}

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projectTasks", projectId, "all"],
    queryFn: () => getProjectTasks(projectId),
    enabled: Boolean(projectId),
  });

  const tasks: ProjectTaskItem[] = Array.isArray(data)
    ? data
    : data?.tasks ?? [];

  if (isLoading) {
    return (
      <ListViewSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-md shadow-xs border border-slate-200 p-8 text-center mb-10">
        <p className="text-base font-medium text-slate-800 mb-2">
          Failed to load tasks
        </p>
        <button
          onClick={() => refetch()}
          className="btn px-4 py-2 text-sm rounded-sm cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (tasks.length === 0 ) {
    return (
      <div className="w-full min-h-[60vh] bg-white rounded-md shadow-xs border border-slate-200 p-12 text-center mb-10">
        <p className="text-base font-medium text-slate-700 mb-1">
          No tasks found
        </p>
        <p className="text-sm text-slate-400 mb-6">
          There are no tasks for this project yet.
        </p>
        <button
          onClick={() => navigate(`/project/${projectId}/tasks/new`)}
          className="btn inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden mb-10">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E0E8FF4D] border-b border-slate-200 label-sm">
            <tr className="text-slate-600">
              <th className="py-4 px-6 font-semibold whitespace-nowrap">TASK</th>
              <th className="py-4 px-6 font-semibold">TITLE</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">DUE DATE</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">STATUS</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">ASSIGNEE</th>
              <th className="py-4 px-6 text-right font-semibold whitespace-nowrap">SETTINGS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const statusKey = task.status?.replace(/ /g, "_") || "TO_DO";
              const statusInfo = STATUS_CONFIG[statusKey] || {
                label: task.status || "To Do",
                color: "#3B82F6",
                bg: "bg-blue-50",
              };

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Task ID */}
                  <td className="py-4 px-6 text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {task.task_id || `TASK-${task.id.slice(0, 4).toUpperCase()}`}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`font-medium ${
                        task.status === "DONE"
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-6 text-sm text-slate-500 whitespace-nowrap">
                    {task.due_date ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDate(task.due_date)}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${statusInfo.color}15`,
                        color: statusInfo.color,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: statusInfo.color }}
                      />
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {task.assignee?.name ? (
                      <div className="flex items-center gap-2">
                        <BoxName
                          size={8}
                          name={task.assignee.name}
                          fontTheme="text-[10px]"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Settings */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
                      aria-label="Settings"
                    >
                      <EllipsisVertical size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
        <span className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{tasks.length}</span> of{" "}
          <span className="font-medium text-slate-700">{tasks.length}</span> results
        </span>
        <Pagination
          currentPage={1}
          totalPages={Math.max(1, Math.ceil(tasks.length / 10))}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
};

export default TaskListView;
