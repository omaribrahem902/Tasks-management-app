import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Layers,
  RefreshCw,
  SearchX,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef } from "react";
import BoxName from "../../../components/BoxName";
import TaskModalHeader from "./TaskModalHeader";
import TaskModalSkeleton from "./TaskModalSkeleton";
import { getTaskDetails, type ProjectTaskDetail } from "./taskModalAPI";
import {
  formatTaskDate,
  getPriorityConfig,
  getStatusConfig,
} from "./taskModalUtils";

export interface TaskModalProps {
  taskId?: string | null;
  projectId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal = ({
  taskId,
  projectId,
  isOpen,
  onClose,
}: TaskModalProps) => {
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Manage focus restoration and body scroll
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle Escape key with capture phase to prevent parent modal (EpicModal) from closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  // Query task details from backend
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProjectTaskDetail[]>({
    queryKey: ["taskDetails", projectId, taskId],
    queryFn: () => getTaskDetails(projectId as string, taskId as string),
    enabled: Boolean(isOpen && projectId && taskId),
    staleTime: 1000 * 30,
  });

  if (!isOpen) return null;

  // Stale check: ensure previous task info is not shown while loading another task
  const rawTask = Array.isArray(data) && data.length > 0 ? data[0] : null;
  const isCurrentData = rawTask && rawTask.id === taskId;
  const showLoading = isLoading || (isFetching && !isCurrentData);

  // Extract task properties with safe fallbacks
  const task = isCurrentData ? rawTask : null;
  const isEmpty = Array.isArray(data) && data.length === 0 && !showLoading && !isError;

  const assigneeName =
    task?.assignee_name ||
    task?.assignee?.name ||
    (typeof task?.assignee === "string" ? task?.assignee : null) ||
    "";

  const assigneeAvatar =
    task?.assignee_avatar ||
    task?.assignee?.avatar ||
    null;

  const isUnassigned =
    !assigneeName ||
    assigneeName.trim().toLowerCase() === "unassigned";

  const reporterName =
    task?.reporter ||
    task?.reporter_name ||
    (typeof task?.created_by === "object" ? task?.created_by?.name : task?.created_by) ||
    "—";

  const epicIdentifier =
    task?.epic_id ||
    task?.epic?.epic_id ||
    task?.epic?.title ||
    null;

  const statusConfig = getStatusConfig(task?.status);
  const priorityConfig = getPriorityConfig(task?.priority);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onClick={(e) => {
        // Prevent clicking outside from propagating to underlying modals (e.g. EpicModal)
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-y-auto rounded-xl bg-white p-6 md:p-8 shadow-2xl custom-scrollbar border border-slate-100"
      >
        {/* Header with task identifier and close button */}
        <TaskModalHeader taskId={taskId || undefined} onClose={onClose} />

        {/* 1. Loading State */}
        {showLoading && <TaskModalSkeleton />}

        {/* 2. Error State */}
        {!showLoading && isError && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 p-8 text-center my-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-semibold text-red-900 mb-1">
              Failed to load task details
            </h3>
            <p className="text-xs text-red-600 max-w-md mb-6">
              {error instanceof Error
                ? error.message
                : "Unable to connect to the server. Please check your connection and try again."}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="btn inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 3. Empty State */}
        {!showLoading && !isError && isEmpty && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center my-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/60 text-slate-500">
              <SearchX size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              Task not found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              The requested task could not be found or may have been deleted from this project.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* 4. Task Details Content */}
        {!showLoading && !isError && task && (
          <div className="flex flex-col gap-6">
            {/* Task Title */}
            <div>
              <h1
                id="task-details-title"
                className="text-xl md:text-2xl font-bold text-slate-900 break-words leading-snug"
              >
                {task.title}
              </h1>

              {/* Status & Priority & Epic Pills row */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: statusConfig.dotColor }}
                  />
                  {statusConfig.label}
                </span>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor}`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: priorityConfig.dotColor }}
                  />
                  Priority: {priorityConfig.label}
                </span>

                {/* Related Epic Badge (if applicable) */}
                {epicIdentifier && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E0E8FF] px-2.5 py-1 text-xs font-semibold text-[#003D9B]">
                    <Layers size={13} />
                    <span>{epicIdentifier}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                Description
              </span>
              {task.description && task.description.trim() ? (
                <p className="whitespace-pre-wrap break-words text-sm text-slate-700 leading-relaxed">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">
                  No description provided.
                </p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Assignee */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Assignee
                </span>
                {isUnassigned ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <User size={14} />
                    </div>
                    <span className="text-sm italic text-slate-400">
                      Unassigned
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    {assigneeAvatar ? (
                      <img
                        src={assigneeAvatar}
                        alt={assigneeName}
                        className="h-7 w-7 rounded-lg object-cover border border-slate-200"
                        onError={(e) => {
                          // Hide broken image and fallback to initials
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <BoxName
                        name={assigneeName}
                        size={7}
                        fontTheme="text-[10px] font-bold"
                      />
                    )}
                    <span className="text-sm font-medium text-slate-800 truncate" title={assigneeName}>
                      {assigneeName}
                    </span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Status
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: statusConfig.dotColor }}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Priority
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: priorityConfig.dotColor }}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {priorityConfig.label}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Due Date
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-800">
                    {formatTaskDate(task.due_date)}
                  </span>
                </div>
              </div>

              {/* Created By */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Created By
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <UserCheck size={13} />
                  </div>
                  <span className="text-sm font-medium text-slate-800 truncate" title={reporterName}>
                    {reporterName}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                  Created At
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-800">
                    {formatTaskDate(task.created_at)}
                  </span>
                </div>
              </div>

              {/* Related Epic ID (if present) */}
              {epicIdentifier && (
                <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white sm:col-span-2 lg:col-span-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
                    Related Epic
                  </span>
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-[#003D9B]" />
                    <span className="text-sm font-semibold text-[#003D9B]">
                      {epicIdentifier}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
