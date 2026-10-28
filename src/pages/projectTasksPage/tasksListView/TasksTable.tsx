import { Calendar, EllipsisVertical } from "lucide-react";
import BoxName from "../../../components/BoxName";
import { formatDate } from "../../../utils/formatDate";
import type { ProjectTaskItem } from "./utils";
import { STATUS_CONFIG } from "./utils";

interface TasksTableProps {
  tasks: ProjectTaskItem[];
  projectId: string;
  setSelectedTask: (task: { taskId: string; projectId: string }) => void;
}
const TasksTable = ({ tasks, projectId, setSelectedTask }: TasksTableProps) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E0E8FF4D] border-b border-slate-200 label-sm">
            <tr className="text-slate-600">
              <th className="py-4 px-6 font-semibold whitespace-nowrap">
                TASK
              </th>
              <th className="py-4 px-6 font-semibold">TITLE</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">
                DUE DATE
              </th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">
                STATUS
              </th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">
                ASSIGNEE
              </th>
              <th className="py-4 px-6 text-right font-semibold whitespace-nowrap">
                SETTINGS
              </th>
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
                  onClick={() =>
                    setSelectedTask({ taskId: task.id, projectId })
                  }
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  {/* Task ID */}
                  <td className="py-4 px-6 text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {task.task_id ||
                      `TASK-${task.id.slice(0, 4).toUpperCase()}`}
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
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
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
    );
};

export default TasksTable;